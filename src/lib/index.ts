import { getLabelFromID } from "./utils"
import transformers from './transformers'
import fieldTypes from './fieldTypes'
import widgetTypes from './widgetTypes'
import { functions, parseFieldFunctionScript, CMSFieldFunctionConfig } from './fieldFunctions'
import { cloneDeep, mergeWith, get as getProp, has as hasProp, union } from 'lodash-es'
import type { AdminPage } from 'sveltecms/plugins/admin'
import staticFilesPlugin from 'sveltecms/plugins/staticFiles'

import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export const CMSContentFieldPropsAllowFunctions = [
  'label', 'tooltip', 'required', 'disabled',
  'hidden', 'class', 'default', 'value',
  'collapsible', 'collapsed',
  'multiple', 'multipleLabel', 'multipleMin', 'multipleMax',
]

export const cmsConfigurables = ['adminStore','types','lists','contentStores','mediaStores','fields','widgets','collections','transformers']

export type CMSConfigSetting = {
  configPath?:string
  adminStore?:string|CMSStoreConfigSetting
  types?: {[key:string]: CMSContentTypeConfigSetting}
  lists?: {[key:string]: string|(string|number|{id:string|number, value:ConfigSetting})[]}
  contentStores?: {[key:string]: CMSStoreConfigSetting}
  mediaStores?: {[key:string]: CMSStoreConfigSetting}
  fields?: {[key:string]: CMSContentFieldConfigSetting}
  widgets?: {[key:string]: CMSWidgetConfigSetting}
  collections?: {[key:string]: CollectionConfigSetting}
  transformers?: {[key:string]: CMSFieldTransformerSetting}
}
export default class SvelteCMS {

  conf:CMSConfigSetting = {}
  admin: CMSContentType
  adminPages?: {[key:string]:AdminPage} = {}
  adminCollections?: {[key:string]:AdminCollection} = {}
  fields:{[key:string]:CMSContentFieldConfigSetting} = {}
  collections: {[key:string]:Collection} = {}
  components: {[key:string]:Object} = {}
  widgets:{[key:string]:CMSWidgetConfigSetting} = {}
  fieldFunctions:{[key:string]:CMSFieldFunctionType} = functions
  fieldTypes:{[key:string]:CMSFieldType} = fieldTypes
  widgetTypes:{[key:string]:CMSWidgetType} = widgetTypes
  transformers:{[key:string]:CMSFieldTransformer} = transformers
  contentStores:{[key:string]:CMSContentStoreType} = {}
  mediaStores:{[key:string]:CMSMediaStoreType} = {}
  types:{[key:string]:CMSContentType} = {}
  lists:CMSListConfig = {}
  constructor(conf:CMSConfigSetting, plugins:CMSPlugin[] = []) {

    this.conf = conf
    this.use(staticFilesPlugin)
    plugins.forEach(p => this.use(p))

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists || []).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    });

    // Initialize all of the stores, widgets, and transformers specified in config
    ['contentStores', 'mediaStores', 'transformers'].forEach(objectType => {
      if (conf?.[objectType]) {
        Object.entries(conf[objectType]).forEach(([k,settings]) => {

          // config can:
          // - create a new item (`conf.widgetTypes.newItem = ...`)
          // - modify an existing item (`conf.widgetTypes.text = ...`)
          // - create a new item based on an existing item (`conf.widgetTypes.longtext = { type:"text", ... })
          const type = conf[objectType][k].type || conf[objectType][k].id || k

          // we merge all of the following
          this[objectType][type] = this.mergeConfigOptions(
            // the base item of this type
            cloneDeep(this[objectType][type] || {}),
            // the config item
            // @ts-ignore
            settings,
            // the config item, as a set of options (for shorthand)
            { options: settings }
          )

        })
      }
    });

    ['fields', 'widgets'].forEach(objectType => {
      if (conf?.[objectType]) this[objectType] = {...conf[objectType]}
    })

    if (conf.collections) {
      Object.entries(conf.collections).forEach(([id,conf]) => {
        let collection = new Collection(conf, this)
        // @ts-ignore - this is a type check
        if (collection.admin) this.adminCollections[collection.id] = collection
        else this.collections[collection.id] = collection
      })
    }

    // Build out config for the content types
    Object.entries(conf?.types || {}).forEach(([id,conf]) => {
      this.types[id] = new CMSContentType(id, conf, this)
    });

    let adminStore = conf.adminStore || conf.configPath || 'src/sveltecms.config.json'
    if (typeof adminStore === 'string') {
      let contentDirectory = adminStore.replace(/\/[^\/]+$/, '')
      let fileExtension = adminStore.replace(/.+[\.]/, '')
      if (!['json','yml','yaml'].includes(fileExtension)) throw new Error('adminStore must end in .json, .yml, or .yaml.')
      adminStore = {
        id: 'staticFiles',
        options: {
          prependContentTypeIdAs: '',
          contentDirectory,
          fileExtension,
        }
      }
    }
    this.admin = new CMSContentType('admin', {
      label: 'Admin',
      contentStore: adminStore,
      slug: {
        fields: ['configPath'],
        slugify: 'getFilename'
      },
      fields: {
        configPath:'text',
        ...Object.fromEntries(cmsConfigurables.map(k => [k, 'collection']))
      }
    }, this)

  }

  use(plugin:CMSPlugin, config?:any) {
    // TODO: allow function that returns plugin

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists','adminPages','components'].forEach(k => {
      plugin?.[k]?.forEach(conf => {
        try {
          this[k][conf.id] = conf
        }
        catch(e) {
          console.error(this)
          throw e
        }
      })
    });

    plugin?.collections?.forEach((conf:CollectionConfigSetting) => {
      let collection = new Collection(conf, this)
      // @ts-ignore - this is a type check
      if (collection.admin) this.adminCollections[collection.id] = collection
      else this.collections[collection.id] = collection
    })

  }

  preMount(container:CMSContentType|CMSContentField, values:Object) {
    let res = {}
    Object.entries(container.fields).forEach(([id,field]) => {
      try {
        if (field?.fields && values?.[id]) {
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
    res['_slug'] = values['_slug']
    return res
  }

  preSave(container:CMSContentType|CMSContentField, values:Object) {
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
    res['_slug'] = values['_slug']
    return res
  }

  doTransforms(op:'preSave'|'preMount', field:CMSContentField, value:any) {
    try {
      if (field[op] && field[op].length && value !== undefined && value !== null) {
        field[op].forEach((functionConfig:CMSFieldTransformerSetting) => {
          if (Array.isArray(value)) value = value.map(v => this.runFunction('transformers', functionConfig, v))
          else value = this.runFunction('transformers', functionConfig, value)
        })
      }
      return value
    }
    catch(e) {
      e.message = `value: ${JSON.stringify(value, null, 2)}\n${field.id}/${op} : ${e.message}`
      throw e
    }
  }

  getConfigTypes(path:string, arg?:string):string[] {
    switch (path) {
      case 'fields':
        return this.getFieldTypes()
      case 'widgets':
        return this.getFieldTypeWidgets(arg)
      case 'types':
      case 'lists':
      case 'contentStores':
      case 'mediaStores':
      case 'collections':
      case 'transformers':
        return Object.keys(this[path])
      default:
        return []
    }
  }

  getFieldTypes() {
    return union(Object.keys(this.fieldTypes || {}), Object.keys(this.fields || {}))
  }

  getFieldTypeWidgets(fieldType) {
    if (!fieldType) return union(Object.keys(this.widgetTypes || {}), Object.keys(this.widgets || {}))
    return union(
      Object.entries(this.widgetTypes).map(([id,w]) => {
        if (!w.hidden && w.fieldTypes.includes(fieldType)) return id
      }).filter(Boolean),
      Object.entries(this.widgets).map(([id,w]) => {
        if (this.widgetTypes[w.type].fieldTypes.includes(fieldType)) return id
      }).filter(Boolean)
    )
  }

  getContentType(contentType:string):CMSContentType {
    if (!this.types[contentType]) throw new Error (`Content type not found: ${contentType}`)
    return this.types[contentType]
  }

  getCollection(contentType:string|CMSContentType, valuePath:string):CMSContentField {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    let configPath = getConfigPathFromValuePath(valuePath)
    let field = <CMSContentField> getProp(contentType, configPath)
    if (!field || !(field?.type === 'collection') || !(field?.fields)) throw new Error (`${contentType}.${configPath} is not a valid collection`)
    return field
  }

  getContentStore(contentType:string|CMSContentType) {
    const type = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    return type.contentStore
  }

  slugifyContent(content:any, contentType:CMSContentType, force?:boolean) {
    if (Array.isArray(content)) {
      content.forEach(c => {
        c._slug = this.getSlug(c, contentType, force)
      })
    }
    else {
      content._slug = this.getSlug(content, contentType, force)
    }
    return content
  }

  getSlug(content:any, contentType:CMSContentType, force:boolean) {
    if (content._slug && !force) return content._slug
    let newSlug = contentType.slug.fields.map(id => { return getProp(content,id) }).filter(Boolean).join(contentType.slug.separator)
    return this.runFunction('transformers', contentType.slug.slugify, newSlug)
  }

  async listContent(contentType:string|CMSContentType, options:{load?:boolean, [key:string]:any} = {}):Promise<Array<any>> {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    const rawContent = await db.listContent(contentType, db.options)
    if (!rawContent) return
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    // @ts-ignore contentType has by now been type checked
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : [this.preMount(contentType, rawContent)]
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
  async getContent(contentType:string|CMSContentType, slug?:string|number|null, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    const rawContent = await db.getContent(contentType, db.options, slug)
    if (!rawContent) return
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    // @ts-ignore contentType has by now been type checked
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : this.preMount(contentType, rawContent)
  }

  async saveContent(contentType:string|CMSContentType, content:any, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.saveContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
  }

  async deleteContent(contentType:string|CMSContentType, content:any, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.deleteContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
  }

  runFunction(functionType:'transformers'|'contentStorage'|'mediaStorage', conf:string|CMSFieldTransformerSetting, value) {
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

  getConfigOptionsFromFields(optionFields:{[id:string]:CMSConfigFieldConfigSetting}):ConfigSetting {
    let options:ConfigSetting = Object.assign({}, Object.fromEntries(Object.entries(optionFields).map(([id,optionFieldConf]) => {
      if (optionFieldConf.fields) return [id, this.getConfigOptionsFromFields(optionFieldConf.fields)]
      return [id, this.getConfigOptionValue(optionFieldConf.default)]
    })))
    return options
  }

  mergeConfigOptions(options1:ConfigSetting, ...optionsAll:Array<string|ConfigSetting>):ConfigSetting {
    let options = cloneDeep(options1)
    optionsAll.forEach(options2 => {
      if (typeof options2 !== 'string') mergeWith(options, options2, (a,b) => {
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

  getWidgetFields(
    collection:CMSContentType|CMSContentField,
    vars:{ values:any, errors:any, touched:any, id?:string },
  ):CMSWidgetFieldCollection {
    let c = cloneDeep(collection)
    // @ts-ignore
    c.eventListeners = []
    Object.keys(c.fields).forEach(id => {
      this.initializeContentField(c.fields[id], {...vars, id})
      // @ts-ignore
      c.fields[id].events?.forEach(e => c.eventListeners.push(e))
    })
    // @ts-ignore
    return c
  }

  initializeContentField(field:CMSContentField, vars:{ values:any, errors:any, touched:any, id?:string }) {
    field.values = vars?.values || {}
    field.errors = vars?.errors || {}
    field.touched = vars?.touched || {}
    CMSContentFieldPropsAllowFunctions.forEach(prop => {
      let func = getProp(field, prop)
      if (func?.function && typeof func.function === 'string') {
        this.initializeFunction(field, prop, {...vars, field})
      }
    })
    // @ts-ignore
    field.events = field?.events?.map(e => { return {
      on: e.on,
      id: vars.id,
      function: new CMSFieldFunction(e.function, {...vars, field}, this)
    }})

    if (field.widget.options) this.initializeConfigOptions(field.widget.options, {...vars, field})
  }

  /**
   * Converts an object property (e.g. on a CMSContentField or an options object) into a getter which runs
   * one of the available functions.
   * @param obj The object on which the property is to be defined
   * @param prop The name of the property
   * @param vars The vars object for the defined function
   */
  initializeFunction(obj:{[key:string]:any}, prop:string, vars:{ field:CMSContentField, values:any, errors:any, touched:any, id?:string }) {
    let conf = cloneDeep(getProp(obj, prop))
    // console.log({name:'preInitializeFunction', obj, prop, conf:cloneDeep(conf)}) // debug functions
    let func = new CMSFieldFunction(conf, vars, this)
    // special case for the function that only runs once
    let parentPath = prop.replace(/(?:(?:^|\.)[^\.]+|\[[^\]]\])$/, '')
    let propPath = prop.replace(/^.+\./, '')
    let parent = parentPath.length ? getProp(obj, parentPath) : obj
    if (func.id === 'once') {
      parent[propPath] = func.fn({...vars, cms:this}, func.options)
    }
    else {
      Object.defineProperty(parent, propPath, {
        get: () => {
          let result = func.fn({...vars, cms:this}, func.options)
          // console.log({ name:'run', result, vars, func }) // debug functions
          return result
        }
      })
    }
    // console.log({name:'postInitializeFunction',obj,conf:cloneDeep(conf),func,parentPath,propPath,parent,vars}) // debug functions
  }

  initializeConfigOptions(options, vars:{ field:CMSContentField, values:any, errors:any, touched:any, id?:string }) {
    // console.log({name:'initializeConfigOptions', count:Object.keys(options).length, options:cloneDeep(options)}) // debug functions
    Object.keys(options).forEach(k => {
      if (options[k]?.function && typeof options[k]?.function === 'string') {
        this.initializeFunction(options, k, vars)
      }
    })
  }

  getValidatorConfig(fieldset:{[id:string]:CMSContentField}):Rules {
    let configValues = {}
    Object.keys(fieldset).forEach(k => {
      if (fieldset[k]?.fields) configValues[k] = this.getValidatorConfig(fieldset[k].fields)
      else configValues[k] = fieldset[k].validator
      if (configValues[k] && fieldset[k]?.multiple) configValues[k] = [configValues[k]]
    })
    return configValues
  }

  getAdminPage(path:string):AdminPage {
    let pathArray = path.replace(/(^\/|\/$)/g,'').split('/')
    path = pathArray.join('/')
    if (this.adminPages[path]) return this.adminPages[path]
    for (let i=pathArray.length-1; i>0; i--) {
      pathArray[i] = '*'
      path = pathArray.join('/')
      if (this.adminPages[path]) return this.adminPages[path]
    }
  }

  get defaultMediaStore():string {
    let k = (Object.keys(this.mediaStores || {}))[0]
    if (!k) throw new Error('CMS has no mediaStores, but one is required by a field')
    return k
  }

}

export type CMSSlugConfigSetting = {
  fields: string|string[]
  separator?: string
  slugify?: string|CMSFieldTransformerSetting
}

export class CMSSlugConfig {
  fields:string[]
  separator: string = '-'
  slugify: string|CMSFieldTransformerSetting = 'slugify'
  constructor(conf:string|string[]|CMSSlugConfigSetting, cms:SvelteCMS) {
    if (typeof conf === 'string') {
      this.fields = conf.split(splitter)
    }
    else if (Array.isArray(conf)) {
      this.fields = conf
    }
    else {
      this.fields = typeof conf.fields === 'string' ? conf.fields.split(splitter) : conf.fields
      if (conf.slugify) this.slugify = conf.slugify
    }
    return this
  }
}

export class CMSContentType {
  id:string
  label:string = ''
  slug:CMSSlugConfig
  contentStore:CMSContentStore
  mediaStore?:string|CMSStoreConfigSetting
  fields:{[key:string]:CMSContentField} = {}
  form?: {
    method?:'post'|'get'
    action?:string
    previewComponent?:string
  }
  constructor(id, conf:CMSContentTypeConfigSetting, cms:SvelteCMS) {
    this.id = id
    this.label = conf.label || getLabelFromID(this.id)

    this.contentStore = new CMSContentStore(conf?.contentStore, cms)
    this.mediaStore = conf.mediaStore

    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new CMSContentField(id, conf, cms, this)
    })

    let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || ''
    this.slug = new CMSSlugConfig(slugConf, cms)

  }
}

export type CMSWidgetField = CMSContentField & {
  label:string
  tooltip?:string
  required?:boolean,
  disabled?:boolean,
  hidden?:boolean,
  class:string,
  collapsible?:boolean,
  collapsed?:boolean,
  multiple?:boolean,
  multipleLabel?:boolean,
  multipleMin?:number
  multipleMax?:number
}

export type CMSWidgetFieldCollection = {
  fields: {[id:string]: CMSWidgetField}
  [key:string]:any
}
export class CMSContentField {
  id: string
  type: string

  // should be implemented by every widget
  label: string|CMSFieldFunctionConfig
  tooltip?: string|CMSFieldFunctionConfig = ''
  required?: boolean|CMSFieldFunctionConfig
  disabled?: boolean|CMSFieldFunctionConfig

  // should be implemented by the CMS
  hidden?: boolean|CMSFieldFunctionConfig
  class:string|CMSFieldFunctionConfig = ''
  default?: any
  value?: any
  events?:{on:string,function:CMSFieldFunctionConfig}[]

  // implemented only in Multiple and Collection widgets
  // implement as needed in custom widgets
  collapsible?:boolean|CMSFieldFunctionConfig
  collapsed?:boolean|CMSFieldFunctionConfig
  multiple?: boolean|CMSFieldFunctionConfig
  multipleLabel?:boolean|CMSFieldFunctionConfig
  multipleMin?:number|CMSFieldFunctionConfig
  multipleMax?:number|CMSFieldFunctionConfig

  // not implemented in widgets
  validator?: Rules
  fields?:{[key:string]:CMSContentField}
  widget:CMSWidget
  preSave?:(string|CMSFieldTransformerSetting)[]
  preMount?:(string|CMSFieldTransformerSetting)[]
  mediaStore?:CMSMediaStore

  // Items that are only used when initialized for an entry form
  values:{[key:string]:any} = {} // all form values
  errors:{[key:string]:any} = {} // all form errors
  touched:{[key:string]:any} = {} // all touched form elements
  constructor(id, conf:string|CMSContentFieldConfigSetting, cms:SvelteCMS, contentType?:CMSContentType) {

    // Set the field's id. This identifies the instance, not the field type;
    // in values objects, the key would be this id, e.g. values[id] = 'whatever'
    this.id = id

    // Sort out the type first, because if it doesn't exist that's an error
    conf = typeof conf === 'string' ? { type: conf } : conf
    let field = cms.fields[conf.type]
    field = typeof field === 'string' ? { type:field } : field

    // @ts-ignore TODO: figure out why this is complainey
    if (field) conf = cms.mergeConfigOptions(field, conf, { type: field.type })

    if (typeof conf !== 'string') { // Always true; see above. TODO: figure out how to change type mid-function, and remove if statement
      let fieldType = cms.fieldTypes?.[conf.type]
      if (!fieldType) throw new Error(`SvelteCMS: field type "${conf.type}" does not exist`)
      this.type = conf.type
      this.label = parseFieldFunctionScript(conf.label) ?? (typeof conf.label === 'string' ? conf.label : getLabelFromID(id)) // text is required
      this.value = parseFieldFunctionScript(conf.value) ?? conf.value
      this.tooltip = parseFieldFunctionScript(conf.value) ?? (typeof conf.tooltip === 'string' ? conf.tooltip : '')

      if (conf.multiple) {
        if (hasProp(conf.multiple, 'label') || hasProp(conf.multiple, 'max') || hasProp(conf.multiple, 'min')) {
          this.multiple = true
          this.multipleLabel = conf.multiple?.['label']
          this.multipleMin = conf.multiple?.['min']
          this.multipleMax = conf.multiple?.['max']
        }
        else this.multiple = parseFieldFunctionScript(conf.multiple) ?? (conf.multiple ? true : false)
      }

      if (conf.events) {
        if (!Array.isArray(conf.events)) conf.events = [conf.events]
        this.events = conf.events.map(e => {
          return { on: e.on, function: parseFieldFunctionScript(e.function) }
        }).filter(e => e.on && e.function)
      }

      this.default = parseFieldFunctionScript(conf.default) ?? conf.default ?? fieldType.defaultValue
      this.required = parseFieldFunctionScript(conf.required) ?? (typeof conf.required === 'boolean' ? conf.required : false)
      this.disabled = parseFieldFunctionScript(conf.disabled) ?? (typeof conf.disabled === 'boolean' ? conf.disabled : false)
      this.hidden = parseFieldFunctionScript(conf.hidden) ?? (typeof conf.hidden === 'boolean' ? conf.hidden : false)
      this.collapsible = parseFieldFunctionScript(conf.collapsible) ?? (typeof conf.collapsible === 'boolean' ? conf.collapsible : false)
      this.collapsed = parseFieldFunctionScript(conf.collapsed) ?? (typeof conf.collapsed === 'boolean' ? conf.collapsed : false)
      this.widget = new CMSWidget(conf.widget || fieldType.defaultWidget, cms)
      if (conf?.widgetOptions) this.widget.options = cms.mergeConfigOptions(this.widget.options, conf.widgetOptions)
      this.validator = conf.validator ?? fieldType.defaultValidator
      this.preSave = conf.preSave ? ( Array.isArray(conf.preSave) ? conf.preSave : [conf.preSave] ) : fieldType.defaultPreSave
      this.preMount = conf.preMount ? ( Array.isArray(conf.preMount) ? conf.preMount : [conf.preMount] ) : fieldType.defaultPreMount
      this.class = parseFieldFunctionScript(conf.class) ?? (typeof conf.class === 'string' ? conf.class : '')
      if (conf.fields) {
        this.fields = {}
        Object.entries(conf.fields).forEach(([id, conf]) => {
          this.fields[id] = new CMSContentField(id, conf, cms, contentType)
        })
      }
      if (this.widget.handlesMedia) {
        this.mediaStore = new CMSMediaStore((conf?.['mediaStore'] || contentType?.mediaStore || cms.defaultMediaStore), cms)
      }
    }
  }
}

export class CMSWidget {
  type: string
  widget: Object
  handlesMultiple: boolean
  handlesMedia: boolean
  options?: ConfigSetting
  formDataHandler?:FormDataHandler
  constructor(conf:string|CMSWidgetConfigSetting, cms:SvelteCMS) {
    // TODO: change per CMSContentField changes
    conf = typeof conf === 'string' ? { type: conf } : conf
    let widget = cms.widgets[conf.type]
    widget = typeof widget === 'string' ? { type: widget } : widget

    // @ts-ignore TODO: figure out how to specify that mergeConfigOptions returns the same type as the parameter
    if (widget) conf = cms.mergeConfigOptions(widget, conf, { type: widget.type })

    let widgetType = cms.widgetTypes[conf['type']]
    this.type = widgetType?.id
    this.widget = widgetType?.widget
    this.handlesMultiple = widgetType?.handlesMultiple || false
    this.handlesMedia = widgetType?.handlesMedia || false
    if (widgetType?.formDataHandler) { // formDataHandler can only be set on the widget type
      this.formDataHandler = widgetType.formDataHandler
    }
    if (widgetType?.optionFields) {
      this.options = cms.getConfigOptionsFromFields(widgetType.optionFields)
      if (conf['options']) {
        this.options = cms.mergeConfigOptions(this.options, conf['options'])
      }
    }
  }
}

const noStore = async () => {
  // @ts-ignore
  console.error(`Store not found: (${this?.['id'] || ''})`)
}

export class CMSContentStore {
  id:string
  listContent:(contentType:CMSContentType, options:ConfigSetting)=>Promise<any[]>
  getContent:(contentType:CMSContentType, options:ConfigSetting, slug?:string|number)=>Promise<any|any[]>
  saveContent:(content:any, contentType:CMSContentType, options:ConfigSetting)=>Promise<any>
  deleteContent:(content:any, contentType:CMSContentType, options:ConfigSetting)=>Promise<any>
  options:ConfigSetting
  constructor(conf:string|CMSStoreConfigSetting, cms:SvelteCMS) {
    let store = typeof conf === 'string' ? cms.contentStores[conf] : cms.contentStores[conf?.id]
    if (!store) store = Object.values(cms.contentStores)[0]
    this.id = store?.id
    this.listContent = store?.listContent || (async () => { console.error(`Store not found: (${this?.['id']})`); return []; })
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

export class CMSMediaStore {
  id:string
  listMedia:(path?:string|null, options?:ConfigSetting)=>Promise<string[]>
  getMedia:(filename?:string|number|null, options?:ConfigSetting)=>Promise<string|string[]>
  saveMedia:(file:Blob, options?:ConfigSetting)=>Promise<string>
  deleteMedia:(filename:string, options?:ConfigSetting)=>Promise<any>
  // getPreview?:(file:Blob, options?:ConfigSetting)=>Promise<string>
  // deletePreview?:(file:Blob, options?:ConfigSetting)=>Promise<any>
  immediateUpload?:boolean
  options?:ConfigSetting
  constructor(conf:string|CMSStoreConfigSetting, cms:SvelteCMS) {
    let store = typeof conf === 'string' ? cms.mediaStores[conf] : cms.mediaStores[conf?.id]
    if (!store) store = Object.values(cms.mediaStores)[0]
    this.id = store?.id
    this.listMedia = store?.listMedia ? store.listMedia.bind(this) : async () => { console.error(store?.id ? `No function 'listMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.getMedia = store?.getMedia ? store.getMedia.bind(this) : async () => { console.error(store?.id ? `No function 'getMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.saveMedia = store?.saveMedia ? store.saveMedia.bind(this) : async () => { console.error(store?.id ? `No function 'saveMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.deleteMedia = store?.deleteMedia ? store.deleteMedia.bind(this)  : async () => { console.error(store?.id ? `No function 'deleteMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    // this.getPreview = store?.getPreview ? store.getPreview.bind(this) : undefined
    // this.deletePreview = store?.deletePreview ? store.deletePreview.bind(this) : undefined
    this.options = cms.mergeConfigOptions(
      cms.getConfigOptionsFromFields(store?.optionFields || {}),
      store?.options || {},
      conf?.['options'] || {},
    )
    this.immediateUpload = Boolean(this.options.immediateUpload) || store.immediateUpload
  }
}

export class CMSFieldFunction {
  id: string
  fn: (vars:{ cms:SvelteCMS, field:CMSContentField, values:any, errors:any, touched:any, id?:string }, options:{[key:string]:any}) => any
  vars: { cms:SvelteCMS, field:CMSContentField, values:any, errors:any, touched:any, id?:string}
  options: {[key:string]:string|number|boolean|null|undefined|CMSFieldTransformer & {options?:any}|(string|number|boolean|null|undefined)[]}
  constructor(conf:string|CMSFieldFunctionConfig, vars:{ field:CMSContentField, values:any, errors:any, touched:any, id?:string }, cms:SvelteCMS) {
    if (typeof conf === 'string') conf = parseFieldFunctionScript(conf) // this should be rare, but just in case...
    let func:CMSFieldFunctionType = cms.fieldFunctions[conf.function]
    if (!func) throw `field function not found for ${conf}` // this will also happen if the config is bad
    this.id = func.id
    this.vars = {...vars, cms}
    this.fn = func.fn
    // @ts-ignore
    this.options = cms.getConfigOptionsFromFields(func?.optionFields || {})
    if (Array.isArray(conf.params)) {
      let params = cloneDeep(conf.params)
      let lastKey
      Object.keys(func?.optionFields || {}).forEach((k,i) => {
        // @ts-ignore
        if (params.length) this.options[k] = params.shift()
        lastKey = k
      })
      // for functions where the last param is an array
      if (func?.optionFields?.[lastKey]?.multiple) {
        // @ts-ignore
        if (!Array.isArray(this.options[lastKey])) this.options[lastKey] = [this.options[lastKey]]
        while (params.length) {
          // @ts-ignore
          this.options[lastKey].push(params.shift())
        }
      }
    }
    // }
    cms.initializeConfigOptions(this.options, vars)
    // for transformers
    if (this.id === 'transform') {
      this.options.transformer = cms.transformers[this.options?.transformer?.toString()]
      if (this.options.transformer) this.options.transformer.options = cms.getConfigOptionsFromFields(this.options.transformer)
    }
  }
  run() {
    this.fn(this.vars, this.options)
  }
}

/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export function getConfigPathFromValuePath(path:string):string {
  return 'fields.' + path.replace(/\[\d+\]/g,'').replace(/\./g, '.fields.')
}

/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export type ConfigSetting = {[key:string]: string|number|boolean|null|undefined|ConfigSetting|Array<ConfigSetting>}

export type CMSPlugin = {
  adminPages?: AdminPage[]
  fieldTypes?: CMSFieldType[]
  widgetTypes?: CMSWidgetType[]
  transformers?: CMSFieldTransformer[]
  contentStores?: CMSContentStoreType[]
  mediaStores?: CMSMediaStoreType[]
  collections?: CollectionConfigSetting[]
  adminCollections?: CollectionConfigSetting[]
  components?: ComponentConfig[]
  lists?: CMSListConfig
  optionFields?:{[key:string]:CMSConfigFieldConfigSetting}
}

export type CMSPluginBuilder = (config:any) => CMSPlugin

export type CMSListConfig = {[key:string]: Array<string|number|{id:string|number,value:any}>}

export type CMSFieldFunctionType = {
  id:string,
  // TODO: integrate event and el into field functions. See CMSEditorForm.svelte.
  fn:(vars:{ cms:SvelteCMS, field:CMSContentField, values:any, errors:any, touched:any, id?:string }, opts:{[key:string]:any}, event?:Event, el?:HTMLElement) => any
  optionFields?:{[key:string]:CMSConfigFieldConfigSetting}
}

export type CMSFieldFunctionConfigParam = (string|number|boolean|null|CMSFieldFunctionConfigSetting)[]
export type CMSFieldFunctionConfigSetting = string | {
  function?: string
  fn?: string
  params: (string|number|boolean|null|CMSFieldFunctionConfigSetting)[]
}

export type CMSStoreConfigSetting = ConfigSetting & {
  id:string
}

export type CMSContentTypeConfigSetting = {
  label: string
  fields: {[key:string]:string|CMSContentFieldConfigSetting}
  contentStore: string|CMSStoreConfigSetting
  mediaStore?: string|CMSStoreConfigSetting
  slug?: string|string[]|CMSSlugConfigSetting
}

export type CMSContentFieldConfigSetting = {
  type: string
  label?: string
  default?: any
  value?: any
  tooltip?: string
  required?: boolean|CMSFieldFunctionConfigSetting
  disabled?: boolean|CMSFieldFunctionConfigSetting
  hidden?: boolean|CMSFieldFunctionConfigSetting
  collapsible?:boolean|CMSFieldFunctionConfigSetting
  collapsed?:boolean|CMSFieldFunctionConfigSetting
  multiple?: boolean|CMSFieldFunctionConfigSetting|{
    label?:boolean|CMSFieldFunctionConfigSetting
    min?: number|CMSFieldFunctionConfigSetting
    max?: number|CMSFieldFunctionConfigSetting
  }
  multipleLabel?: string|CMSFieldFunctionConfigSetting
  multipleMin?: number|CMSFieldFunctionConfigSetting
  multipleMax?: number|CMSFieldFunctionConfigSetting
  fields?: {[key:string]:string|CMSContentFieldConfigSetting}
  widget?: string|CMSWidgetConfigSetting
  widgetOptions?: ConfigSetting
  validator?: Rules
  preSave?: string|CMSFieldTransformerSetting|(string|CMSFieldTransformerSetting)[]
  preMount?: string|CMSFieldTransformerSetting|(string|CMSFieldTransformerSetting)[]
  class?: string
  events?: {on:string,function:CMSFieldFunctionConfigSetting}|{on:string,function:CMSFieldFunctionConfigSetting}[]
  mediaStore?:string|CMSStoreConfigSetting
}

export type CMSConfigFieldConfigSetting = CMSContentFieldConfigSetting & {
  type: 'text'|'number'|'boolean'|'date'|'collection'|'tags'
  default: any
  fields?: {[key:string]:CMSConfigFieldConfigSetting}
}

export type CMSMedia = {
  src:string,
  alt?:string,
  title?:string,
}

export type CMSContentStoreType = {
  id:string
  listContent?:(contentType:CMSContentType, opts:ConfigSetting) => Promise<any[]>
  getContent?:(contentType:CMSContentType, opts:ConfigSetting, slug?:string|number) => Promise<any|any[]>
  saveContent?:(content:any, contentType:CMSContentType, opts:ConfigSetting) => Promise<any>
  deleteContent?:(content:any, contentType:CMSContentType, opts:ConfigSetting) => Promise<any>
  optionFields?: {[key:string]:CMSConfigFieldConfigSetting}
  options?: ConfigSetting
}

export type CMSMediaStoreType = {
  id:string
  listMedia?:(path:string|null, opts:ConfigSetting) => Promise<string[]>
  getMedia?:(filename:string|number|null, opts:ConfigSetting) => Promise<string|string[]>
  saveMedia?:(file:File, opts:ConfigSetting) => Promise<string>
  deleteMedia?:(filename:string, opts:ConfigSetting) => Promise<any>
  // getPreview?:(file:Blob, options?:ConfigSetting)=>Promise<string>
  // deletePreview?:(file:Blob, options?:ConfigSetting)=>Promise<any>
  immediateUpload?:boolean
  optionFields?: {[key:string]:CMSConfigFieldConfigSetting}
  options?: ConfigSetting
}

export type CMSFieldType = {
  id:string
  defaultValue:any
  defaultWidget:string|CMSWidgetConfigSetting
  defaultValidator?:Rules
  defaultPreSave?:Array<string|CMSFieldTransformerSetting>
  defaultPreMount?:Array<string|CMSFieldTransformerSetting>
  hidden?:boolean
}

export type CMSFieldTypeMerge = CMSFieldType & {
  id?:string
  type?:string
  defaultValue?:any
  defaultWidget?:string
}

export type FormDataHandler = (value:{[key:string]:any}, cms:SvelteCMS, contentType:CMSContentType, field:CMSContentField)=>Promise<any>

export type CMSWidgetType = {
  id:string
  widget:Object // TODO: get svelte component object
  fieldTypes:string[]
  handlesMultiple?:boolean
  handlesMedia?:boolean
  optionFields?:{[key:string]:CMSConfigFieldConfigSetting}
  hidden?:boolean
  formDataHandler?:FormDataHandler
}

export type CMSWidgetTypeMerge = {
  id:string
  fieldTypes?:string[]
}

export type CMSWidgetConfigSetting = {
  type:string
  options?:ConfigSetting
}

export type CMSFieldTransformer = {
  id:string,
  fn:(value:any,opts:ConfigSetting,fieldConf:CMSFieldType) => any
  optionFields?:{[key:string]:CMSConfigFieldConfigSetting}
  [key:string]:any
}
export type CMSFieldTransformerSetting = {
  id: string,
  options: ConfigSetting
}

export type ComponentConfig = {
  id:string
  component:Object // TODO: find type for Svelte component
}

export type CollectionConfigSetting = {
  id:string
  fields:{[id:string]:CMSContentFieldConfigSetting}
  component?:string
  admin?:boolean
}
export type AdminCollectionConfigSetting = CollectionConfigSetting & { admin:true }
export class Collection {
  id:string
  component?:string
  admin?:boolean
  fields:{[id:string]:CMSContentField}
  constructor(conf:CollectionConfigSetting, cms:SvelteCMS) {
    this.id = conf.id
    this.component = conf.component
    this.admin = conf.admin
    this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id,conf]) => {
      return [id, new CMSContentField(id, conf, cms)]
    }))
  }
}
export type AdminCollection = Collection & { admin:true }

// export type CMSFieldValidator = {
//   id:string
//   fn:(value:any,opts:ConfigSetting,fieldConf:CMSFieldInstance) => string|Error|void
//   optionFields?:{[key:string]:CMSConfigFieldConfigSetting}
//   noBrowser?:boolean
//   noServer?:boolean
// }
