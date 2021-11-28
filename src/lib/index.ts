import type {
  SvelteCMSConfigSetting,
  SvelteCMSContentTypeConfigSetting,
  SvelteCMSContentFieldConfigSetting,
  SvelteCMSSlugConfigSetting,
  SvelteCMSFieldType,
  SvelteCMSWidgetType,
  SvelteCMSFieldTransformer,
  SvelteCMSPlugin,
  SvelteCMSListConfig,
  SvelteCMSContentStoreType,
  SvelteCMSMediaStoreType,
  SvelteCMSFieldFunctionSetting,
  SvelteCMSConfigFieldConfigSetting,
  ConfigSetting,
  SvelteCMSWidgetTypeConfigSetting,
  SvelteCMSPluginBuilder,
  SvelteCMSStoreConfigSetting,
} from "./global"
import getLabelFromID from "./utils/getLabelFromID"
import transformers from './transformers'
import fieldTypes from './fieldTypes'
import widgetTypes from './widgetTypes'
import * as lodash from 'lodash'
const { cloneDeep, mergeWith } = lodash

import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export default class SvelteCMS {

  fieldTypes:{[key:string]:SvelteCMSFieldType} = fieldTypes
  widgetTypes:{[key:string]:SvelteCMSWidgetType} = widgetTypes
  transformers:{[key:string]:SvelteCMSFieldTransformer} = transformers
  contentStores:{[key:string]:SvelteCMSContentStoreType} = {}
  mediaStores:{[key:string]:SvelteCMSMediaStoreType} = {}
  types:{[key:string]:SvelteCMSContentType} = {}
  lists:SvelteCMSListConfig = {}
  constructor(conf:SvelteCMSConfigSetting, plugins:SvelteCMSPlugin[] = []) {

    plugins.forEach(p => this.use(p))

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    });

    ['contentStores', 'mediaStores', 'widgetTypes', 'transformers'].forEach(objectType => {
      if (conf?.[objectType]) {
        Object.entries(conf[objectType]).forEach(([k,settings]) => {
          const type = conf[objectType][k].type
          if (this[objectType][k]) { Object.assign(this[objectType][k], settings) }
          else if (this[objectType][type]) {
            this[objectType][k] = Object.assign(cloneDeep(this[objectType][type]), { id:k }, settings)
          }
        })
      }
    });

    // Build out config for the content types
    Object.entries(conf?.types).forEach(([id,conf]) => {
      this.types[id] = new SvelteCMSContentType(id, conf, this)
    });

  }

  use(plugin:SvelteCMSPlugin, config?:any) {
    // TODO: allow function that returns plugin

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists'].forEach(k => {
      plugin?.[k]?.forEach(conf => {
        try {
          this[k][conf.id] = conf
        }
        catch(e) {
          console.log(this)
          throw e
        }
      })
    })
  }

  preMount(contentTypeOrField:string|SvelteCMSContentField, values:Object) {
    let container = typeof contentTypeOrField === 'string' ? this.types[contentTypeOrField] : contentTypeOrField
    let res = {}
    Object.entries(container.fields).forEach(([id,field]) => {
      try {
        if (field?.fields && values[id]) {
          if (Array.isArray(values[id])) {
            res[id] = []
            for (let i=0;i<values[id].length;i++) {
              res[id][i] = this.preMount(field, values[id][i])
            }
          }
          else res[id] = this.preMount(field, values?.[id])
        }
        else res[id] = this.doTransforms('preMount', field, this.doTransforms('preSave', field, values?.[id]))
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    })
    return res
  }

  preSave(contentTypeOrField:string|SvelteCMSContentField, values:Object) {
    let container = typeof contentTypeOrField === 'string' ? this.types[contentTypeOrField] : contentTypeOrField
    let res = {}
    Object.entries(container.fields).forEach(([id,field]) => {
      try {
        if (field?.fields && values[id]) {
          res[id] = []
          if (Array.isArray(values[id])) {
            for (let i=0;i<values[id].length;i++) {
              res[id][i] = this.preSave(field, values[id][i])
            }
          }
          else res[id] = this.preSave(field, values?.[id])
        }
        else res[id] = this.doTransforms('preSave', field, values?.[id])
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    })
    return res
  }

  doTransforms(op:'preSave'|'preMount', field:SvelteCMSContentField, value:any) {
    try {
      if (field[op] && field[op].length && value !== undefined && value !== null) {
        field[op].forEach((functionConfig:SvelteCMSFieldFunctionSetting) => {
          if (Array.isArray(value)) {
            value = value.map(v => this.runFunction('transformers', functionConfig, v))
          }
          value = this.runFunction('transformers', functionConfig, value)
          // console.log(`after: (${typeof value}) ${value}`)
        })
      }
      return value
    }
    catch(e) {
      e.message = `value: ${JSON.stringify(value, null, 2)}\n${field.id}/${op} : ${e.message}`
      throw e
    }
  }

  getContentType(contentType:string):SvelteCMSContentType {
    if (!this.types[contentType]) throw new Error (`Content type not found: ${contentType}`)
    return this.types[contentType]
  }

  getContentStore(contentType:string) {
    const type = this.getContentType(contentType)
    return type.contentStore
  }

  /**
   * Gets an individual piece of content or all content of a content type
   * @param contentType string
   * The id of the content type
   * @param slug string
   * The text slug for an individual piece of content (optional)
   * If null or omitted, then all content of the type will be returned
   * @param options object
   * @returns object|object[]
   */
  async getContent(contentType:string, slug?:string|number|null, options:{[key:string]:any} = {}) {
    const type = this.getContentType(contentType)
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    const rawContent = await db.getContent(type, db.options, slug)
    if (options.getRaw) return rawContent
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : this.preMount(contentType, rawContent)
  }

  async saveContent(contentType:string, content:any, options:{[key:string]:any} = {}) {
    const type = this.getContentType(contentType)
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.saveContent(this.preSave(contentType, content), type, db.options)
  }

  async deleteContent(contentType:string, content:any, options:{[key:string]:any} = {}) {
    const type = this.getContentType(contentType)
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.deleteContent(this.preSave(contentType, content), type, db.options)
  }

  runFunction(functionType:'transformers'|'contentStorage'|'mediaStorage', conf:string|SvelteCMSFieldFunctionSetting, value) {
    let id = typeof conf === 'string' ? conf : conf.id
    let func = this[functionType][id]
    if (!func) throw new Error(`${functionType}.${id} does not exist!`)
    let fn = func.fn
    if (!fn) throw new Error(`${functionType}.${id}.fn does not exist!`)
    let opts
    try {
      if (func?.optionFields) {
        opts = this.getConfigOptionsFromFields(func.optionFields)
        // @ts-ignore
        if (conf?.options) opts = this.mergeConfigOptions(opts, conf.options)
      }
      return fn(value, opts)
    }
    catch(e) {
      e.message = `${id} : ${e.message}`
      throw e
    }
  }

  getConfigOptionValue(value) {
    if (typeof value !== 'string' || !value.match(/^\$lists\./)) return value
    let listID = value.replace(/^\$lists\./, '')
    return this.lists[listID]
  }

  getConfigOptionsFromFields(optionFields:{[id:string]:SvelteCMSConfigFieldConfigSetting}):ConfigSetting {
    let options:ConfigSetting = Object.assign({}, Object.fromEntries(Object.entries(optionFields).map(([id,optionFieldConf]) => {
      if (optionFieldConf.fields) return [id, this.getConfigOptionsFromFields(optionFieldConf.fields)]
      return [id, this.getConfigOptionValue(optionFieldConf.default)]
    })))
    return options
  }

  mergeConfigOptions(options1:ConfigSetting, ...optionsAll:ConfigSetting[]):ConfigSetting {
    let options = cloneDeep(options1)
    optionsAll.forEach(options2 => {
      mergeWith(options, options2, (a,b) => {
        let valueA = this.getConfigOptionValue(a)
        let valueB = this.getConfigOptionValue(b)
        if (Array.isArray(valueA) || Array.isArray(valueB)) return valueB
      })
    })
    return options
  }

  getValidator(typeID:string, values:Object):Validator.Validator<Object> {
    let contentType = this.types[typeID]
    let conf = this.getValidatorConfig(contentType.fields)
    return new Validator(values, conf)
  }

  getValidatorConfig(fieldset:{[id:string]:SvelteCMSContentField}):Rules {
    let configValues = {}
    Object.keys(fieldset).forEach(k => {
      if (fieldset[k]?.fields) configValues[k] = this.getValidatorConfig(fieldset[k].fields)
      else configValues[k] = fieldset[k].validator
      if (configValues[k] && fieldset[k]?.multiple) configValues[k] = [configValues[k]]
    })
    return configValues
  }

}

// export class SvelteCMSSlugConfig {
//   fields:string[]
//   slugify:boolean|ConfigSetting = {}
//   transliterate:boolean|ConfigSetting = {}
//   constructor(conf:string|SvelteCMSSlugConfigSetting) {
//     if (!conf) {
//       this.fields = ['slug']
//     }
//     else if (typeof conf === 'string') {
//       this.fields = conf.split(splitter)
//     }
//     else {
//       this.fields = typeof conf.fields === 'string' ? conf.fields.split(splitter) : conf.fields
//       this.slugify = conf.slugify
//       this.transliterate = conf.transliterate
//     }
//     return this
//   }
//   fn(content:{[key:string]:any}) {
//     if (this.fields && this.fields.length) {
//       let slugtext = this.fields.reduce((t,v) => {
//         return t + v.toString()
//       }, '')

//     }
//   }
// }

export class SvelteCMSContentType {
  id:string
  title:string = ''
  // slug:SvelteCMSSlugConfig
  contentStore?:SvelteCMSContentStore
  mediaStore?:SvelteCMSStore
  fields:{[key:string]:SvelteCMSContentField} = {}
  constructor(id, conf:SvelteCMSContentTypeConfigSetting, cms:SvelteCMS) {
    this.id = id
    this.title = conf.title
    // this.slug = new SvelteCMSSlugConfig(this.slug)

    this.contentStore = new SvelteCMSContentStore(conf?.contentStore, cms)
    this.mediaStore = new SvelteCMSStore('media', conf?.mediaStore, cms, this)

    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new SvelteCMSContentField(id, conf, cms, this)
    })
  }
}

export class SvelteCMSContentField {
  id: string
  type: string
  title: string
  default?: any
  description?: string = ''
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  minValues?: number
  maxValues?: number
  validator?: Rules
  fields?:{[key:string]:SvelteCMSContentField}
  widget:SvelteCMSWidget
  preSave?:(string|SvelteCMSFieldFunctionSetting)[]
  preMount?:(string|SvelteCMSFieldFunctionSetting)[]
  class:string = ''
  mediaStore?:SvelteCMSStore
  constructor(id, conf:string|SvelteCMSContentFieldConfigSetting, cms:SvelteCMS, contentType:SvelteCMSContentType) {

    // Set the field's id. This identifies the instance, not the field type;
    // in values objects, the key would be this id, e.g. values[id] = 'whatever'
    this.id = id

    // Sort out the type first, because if it doesn't exist that's an error
    let type = typeof conf === 'string' ? conf : conf?.type
    let fieldType = cms.fieldTypes?.[type]
    if (!fieldType) throw new Error(`SvelteCMS: field type "${type}" does not exist`)

    if (typeof conf === 'string') {
      this.type = conf // the fieldType.id
      this.title = getLabelFromID(id) // capitalized sanely
      this.default = fieldType?.defaultValue

      this.widget = new SvelteCMSWidget(fieldType.defaultWidget, cms)

      this.validator = fieldType?.defaultValidator
      this.preSave = fieldType?.defaultPreSave
      this.preMount = fieldType?.defaultPreMount
    }
    else {
      this.type = conf.type
      this.title = conf.title || getLabelFromID(id) // text is required
      this.description = conf.description || ''
      this.multiple = conf.multiple ?? undefined
      this.minValues = conf.minValues ?? undefined
      this.maxValues = conf.maxValues ?? undefined
      this.required = conf.required ? true : false
      this.disabled = conf.disabled ? true : false
      this.widget = new SvelteCMSWidget(conf.widget || fieldType.defaultWidget, cms)
      if (conf?.widgetOptions) this.widget.options = cms.mergeConfigOptions(this.widget.options, conf.widgetOptions)
      this.validator = conf.validator ?? fieldType.defaultValidator
      this.preSave = conf.preSave ? ( Array.isArray(conf.preSave) ? conf.preSave : [conf.preSave] ) : fieldType.defaultPreSave
      this.preMount = conf.preMount ? ( Array.isArray(conf.preMount) ? conf.preMount : [conf.preMount] ) : fieldType.defaultPreMount
      this.class = conf.class || ''
      if (conf.fields) {
        this.fields = {}
        Object.entries(conf.fields).forEach(([id, conf]) => {
          this.fields[id] = new SvelteCMSContentField(id, conf, cms, contentType)
        })
      }
    }
    if (this.widget.handlesMedia) {
      this.mediaStore = new SvelteCMSStore('media', conf?.['mediaStore'], cms, contentType)
    }
  }
}

export class SvelteCMSWidget {
  type: string
  widget: Object
  handlesMultiple: boolean
  handlesMedia: boolean
  options?: ConfigSetting
  constructor(conf:string|SvelteCMSWidgetTypeConfigSetting, cms:SvelteCMS) {
    let widgetType = typeof conf === 'string' ? cms.widgetTypes[conf] : cms.widgetTypes[conf.id]
    this.type = widgetType?.id
    this.widget = widgetType?.widget
    this.handlesMultiple = widgetType?.handlesMultiple || false
    this.handlesMedia = widgetType?.handlesMedia || false
    if (widgetType?.optionFields) {
      this.options = cms.getConfigOptionsFromFields(widgetType.optionFields)
    }
  }
}

const noStore = async () => {
  // @ts-ignore
  console.error(`Store not found: (${this?.['id'] || ''})`)
}

export class SvelteCMSContentStore {
  id:string
  getContent:(contentType:SvelteCMSContentType, options:ConfigSetting, slug?:string|number)=>Promise<any>
  saveContent:(content:any, contentType:SvelteCMSContentType, options:ConfigSetting)=>Promise<any>
  deleteContent:(content:any, contentType:SvelteCMSContentType, options:ConfigSetting)=>Promise<any>
  options:ConfigSetting
  constructor(conf:string|SvelteCMSStoreConfigSetting, cms:SvelteCMS) {
    let store = typeof conf === 'string' ? cms.contentStores[conf] : cms.contentStores[conf?.id]
    if (!store) store = Object.values(cms.contentStores)[0]
    this.id = store?.id
    this.getContent = store?.getContent || noStore
    this.saveContent = store?.saveContent || noStore
    this.deleteContent = store?.deleteContent || noStore
    this.options = cms.mergeConfigOptions(
      cms.getConfigOptionsFromFields(store?.optionFields || {}),
      store?.options || {},
      conf?.['options'] || {},
    )
  }
}

export class SvelteCMSStore {
  id:string
  list:(options?:ConfigSetting)=>Promise<string[]>
  get:(slug?:string|number|null, options?:ConfigSetting)=>Promise<string|string[]>
  save:(file:any, options?:ConfigSetting)=>Promise<any>
  delete:(file:any, options?:ConfigSetting)=>Promise<any>
  options:ConfigSetting
  constructor(storeType:'content'|'media', conf:string|SvelteCMSStoreConfigSetting, cms:SvelteCMS, contentType:SvelteCMSContentType) {
    let id = typeof conf === 'string' ? conf : conf?.id
    let stores = `${storeType}Stores`
    let store
    if (id) store = contentType?.[stores]?.[id] || cms?.[stores]?.[id]
    if (!store) store = contentType?.[stores] ? Object.values(contentType?.[stores])[0] : Object.values(cms[stores])[0]

    this.id = store?.id || id
    this.list = store?.list ? store.list.bind(this) : async () => { console.error(store?.id ? `No function 'list' for store '${id}'` : `Store ${id} not found`)}
    this.get = store?.get ? store.get.bind(this) : async () => { console.error(store?.id ? `No function 'get' for store '${id}'` : `Store ${id} not found`)}
    this.save = store?.save ? store.save.bind(this) : async () => { console.error(store?.id ? `No function 'save' for store '${id}'` : `Store ${id} not found`)}
    this.delete = store?.delete ? store.delete.bind(this)  : async () => { console.error(store?.id ? `No function 'delete' for store '${id}'` : `Store ${id} not found`)}
    this.options = cms.mergeConfigOptions(
      cms.getConfigOptionsFromFields(store?.optionFields || {}),
      store?.options || {},
      conf?.['options'] || {},
    )
  }
}
