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
  SvelteCMSContentStore,
  SvelteCMSMediaStore,
  SvelteCMSFieldFunctionSetting,
  SvelteCMSConfigFieldConfigSetting,
  ConfigSetting,
  SvelteCMSWidgetTypeConfigSetting,
  SvelteCMSPluginBuilder,
} from "./global"
import type { OptionsSlugify, OptionsTransliterate } from "transliteration/dist/node/src/types"
import getLabelFromID from "./utils/getLabelFromID"
import transformers from './transformers'
import fieldTypes from './fieldTypes'
import widgetTypes from './widgetTypes'
import { mergeWith, cloneDeep, isArray } from 'lodash'

import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export default class SvelteCMS {

  fieldTypes:{[key:string]:SvelteCMSFieldType} = fieldTypes
  widgetTypes:{[key:string]:SvelteCMSWidgetType} = widgetTypes
  transformers:{[key:string]:SvelteCMSFieldTransformer} = transformers
  contentStores:{[key:string]:SvelteCMSContentStore} = {}
  mediaStores:{[key:string]:SvelteCMSMediaStore} = {}
  types:{[key:string]:SvelteCMSContentType} = {}
  lists:SvelteCMSListConfig = {}
  constructor(conf:SvelteCMSConfigSetting, plugins:SvelteCMSPlugin[] = []) {

    plugins.forEach(p => this.use(p))

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    })

    // Build out config for the content types
    Object.entries(conf?.types).forEach(([id,conf]) => {
      this.types[id] = new SvelteCMSContentType(id, conf, this)
    })

  }

  use(plugin:SvelteCMSPlugin|SvelteCMSPluginBuilder, config?:any) {
    // TODO: allow function that returns plugin

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists'].forEach(k => {
      plugin?.[k]?.forEach(conf => {
        this[k][conf.id] = conf
      })
    })
  }

  preMount(contentTypeOrField:string|SvelteCMSContentField, values:Object) {
    let container = typeof contentTypeOrField === 'string' ? this.types[contentTypeOrField] : contentTypeOrField
    Object.entries(container.fields).forEach(([id,field]) => {
      if (field?.fields) {
        Object.entries(field.fields).forEach(([fid,subfield]) => {
          values[id][fid] = this.doTransforms('preMount', subfield, this.doTransforms('preSave', subfield, values[id][fid]))
        })
      }
      values[id] = this.doTransforms('preMount', field, this.doTransforms('preSave', field, values[id]))
    })
  }

  preSave(contentTypeOrField:string|SvelteCMSContentField, values:Object) {
    let container = typeof contentTypeOrField === 'string' ? this.types[contentTypeOrField] : contentTypeOrField
    Object.entries(container.fields).forEach(([id,field]) => {
      if (field?.fields) {
        Object.entries(field.fields).forEach(([fid,subfield]) => {
          values[id][fid] = this.doTransforms('preSave', subfield, values[id][fid])
        })
      }
      values[id] = this.doTransforms('preSave', field, values[id])
    })
  }

  doTransforms(op:'preSave'|'preMount', field:SvelteCMSContentField, value:any) {
    field[op].forEach((functionConfig:SvelteCMSFieldFunctionSetting) => {
      if (isArray(value)) {
        value = value.map(v => this.runFunction('transformer', functionConfig, v))
      }
      value = this.runFunction('transformer', functionConfig, value)
    })
  }

  async save(contentType:string, content:any) {

  }

  async load(contentType:string, id?:string|number) {

  }

  runFunction(functionType:'transformer'|'contentStorage'|'mediaStorage', conf:string|SvelteCMSFieldFunctionSetting, value) {
    let id = typeof conf === 'string' ? conf : conf.id
    let func = this[functionType][id]
    let fn = func.fn
    let opts
    if (func?.optionFields) {
      opts = this.getConfigOptionsFromFields(func.optionFields)
      // @ts-ignore
      if (conf?.options) opts = this.mergeConfigOptions(opts, conf.options)
    }
    return fn(value, opts)
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

  mergeConfigOptions(options1:ConfigSetting, options2:ConfigSetting):ConfigSetting {
    let options = cloneDeep(options1)
    mergeWith(options, options2, (a,b) => {
      let valueA = this.getConfigOptionValue(a)
      let valueB = this.getConfigOptionValue(b)
      if (isArray(valueA) || isArray(valueB)) return valueB
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

export class SvelteCMSSlugConfig {
  fields:string[]
  slugify:boolean|OptionsSlugify = {}
  transliterate:boolean|OptionsTransliterate = {}
  constructor(conf:string|SvelteCMSSlugConfigSetting) {
    if (!conf) {
      this.fields = []
    }
    else if (typeof conf === 'string') {
      this.fields = conf.split(splitter)
    }
    else {
      this.fields = typeof conf.fields === 'string' ? conf.fields.split(splitter) : conf.fields
    }
  }
}

export class SvelteCMSContentType{
  id:string
  title:string = ''
  slug:SvelteCMSSlugConfig
  fields:{[key:string]:SvelteCMSContentField} = {}
  constructor(id, conf:SvelteCMSContentTypeConfigSetting, cms:SvelteCMS) {
    this.id = id
    this.title = conf.title
    this.slug = new SvelteCMSSlugConfig(this.slug)
    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new SvelteCMSContentField(id, conf, cms)
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
  constructor(id, conf:string|SvelteCMSContentFieldConfigSetting, cms:SvelteCMS) {

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
      this.preSave = conf.preSave ? ( isArray(conf.preSave) ? conf.preSave : [conf.preSave] ) : fieldType.defaultPreSave
      this.preMount = conf.preMount ? ( isArray(conf.preMount) ? conf.preMount : [conf.preMount] ) : fieldType.defaultPreMount
      if (conf.fields) {
        this.fields = {}
        Object.entries(conf.fields).forEach(([id, conf]) => {
          this.fields[id] = new SvelteCMSContentField(id, conf, cms)
        })
      }
    }
  }
}

export class SvelteCMSWidget {
  type: string
  widget: Object
  handlesMultiple: boolean
  options?: ConfigSetting
  constructor(conf:string|SvelteCMSWidgetTypeConfigSetting, cms:SvelteCMS) {
    let widgetType = typeof conf === 'string' ? cms.widgetTypes[conf] : cms.widgetTypes[conf.id]
    this.type = widgetType?.id
    this.widget = widgetType?.widget
    this.handlesMultiple = widgetType?.handlesMultiple || false
    if (widgetType?.optionFields) {
      this.options = cms.getConfigOptionsFromFields(widgetType.optionFields)
    }
  }
}