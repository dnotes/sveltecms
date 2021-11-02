import type {
  SvelteCMSConfigSetting,
  SvelteCMSContentTypeConfigSetting,
  SvelteCMSContentFieldConfigSetting,
  SvelteCMSSlugConfigSetting,
  SvelteCMSFieldTypeConfig,
  SvelteCMSFieldTypeConfigMerge,
  SvelteCMSWidgetTypeConfig,
  SvelteCMSWidgetTypeConfigMerge,
} from "./global"
import type { OptionsSlugify, OptionsTransliterate } from "transliteration/dist/node/src/types"
import type { SvelteComponent } from "svelte/internal"
import getLabelFromID from "./utils/getLabelFromID"
import { fieldTypes, widgetTypes } from "./defaults"
import _ from 'lodash'


const splitter = /\s*,\s/g

function mergeDeep(objectA, objectB) {
  return _.mergeWith(Object.assign({}, objectA || {}), objectB || {}, (a,b) => {
    if (_.isArray(a)) return b // overwrite arrays
  })
}

export type SvelteCMSFieldTransformFunction = (value:any,conf:SvelteCMSFieldType) => any

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
  description: string = ''
  default: any
  required: boolean
  disabled: boolean
  multiple?: boolean
  minValues?: number
  maxValues?: number
  fields:{[key:string]:SvelteCMSContentField} = {}
  widget: Promise<SvelteComponent>
  options: {[key:string]:any} = {}
  constructor(id, conf:string|SvelteCMSContentFieldConfigSetting, cms:SvelteCMS) {
    this.id = id

    // Sort out the type first, because if it doesn't exist that's an error
    // @ts-ignore
    let type = conf?.type || conf
    let fieldType = cms.fieldTypes?.[type]
    if (!fieldType) throw new Error(`SvelteCMS: field type "${type}" does not exist`)

    let widget
    if (typeof conf === 'string') {
      this.type = conf
      this.title = getLabelFromID(id)
      this.default = fieldType.defaultValue
      this.required = false
      this.disabled = false
      widget = fieldType.defaultWidget ?? this.type
    }
    else {
      this.type = conf.type
      this.title = conf.title ?? getLabelFromID(id)
      this.description = conf.description ?? ''
      this.multiple = conf.multiple ?? undefined
      this.minValues = conf.minValues ?? undefined
      this.maxValues = conf.maxValues ?? undefined
      this.required = conf.required ? true : false
      this.disabled = conf.disabled ? true : false
      if (conf.fields) {
        Object.entries(conf.fields).forEach(([id, conf]) => {
          this.fields[id] = new SvelteCMSContentField(id, conf, cms)
        })
      }
      widget = conf.widget ?? fieldType?.defaultWidget ?? this.type
    }


    // Get the widget Promise
    if (typeof widget === 'string') {

      // @ts-ignore : Parse the options
      this.options = mergeDeep(cms.widgetTypes?.[widget]?.options || {}, conf?.options)

      // Import the widget
      this.widget = import(/* @vite-ignore */`${widget}.svelte`).then(module => {
        if (!module.default) throw new Error(`No widget found for ${this.title}`)
        return module.default
      })

    }
    else {

      // @ts-ignore : Parse the options
      this.options = conf?.options ?? {}

      // Make a widget a promise
      this.widget = Promise.resolve(this.widget)
    }

  }
}

export class SvelteCMSFieldType {
  id:string
  defaultValue:any
  defaultWidget:string
  defaultTransform:SvelteCMSFieldTransformFunction = v => v
  constructor(id,conf:SvelteCMSFieldTypeConfig) {
    this.id = id
    this.defaultValue = conf.defaultValue
    this.defaultWidget = conf.defaultWidget
    // @ts-ignore
    if (conf?.defaultTransform) this.defaultTransform = conf.defaultTransform
  }
  merge(conf:SvelteCMSFieldTypeConfigMerge):void {
    if (conf.hasOwnProperty('defaultValue')) this.defaultValue = conf.defaultValue
    if (conf.hasOwnProperty('defaultWidget')) this.defaultWidget = conf.defaultWidget
  }
}

export class SvelteCMSWidgetType {
  id:string
  fieldTypes:string[]
  transforms:{[id:string]:SvelteCMSFieldTransformFunction}
  options?:{[key:string]:any}
  constructor(id,conf:SvelteCMSWidgetTypeConfig) {
    this.id = id
    this.fieldTypes = typeof conf.fieldTypes === 'string' ? conf.fieldTypes.split(splitter) : conf.fieldTypes
    this.options = conf?.options ?? undefined
  }
  merge(conf:SvelteCMSWidgetTypeConfigMerge):void {
    if (conf.fieldTypes) {
      conf.fieldTypes.forEach(t => {
        if (!this.fieldTypes.includes(t)) this.fieldTypes.push(t)
      })
    }
  }
}

export default class SvelteCMS {
  fieldTypes:{[key:string]:SvelteCMSFieldType} = {}
  widgetTypes:{[key:string]:SvelteCMSWidgetType} = {}
  types:{[key:string]:SvelteCMSContentType} = {}
  lists:{[key:string]: Array<string|number|{id:string|number,value:any}>} = {}

  constructor(conf:SvelteCMSConfigSetting) {

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    })

    Object.entries(fieldTypes).forEach(([id,conf]) => {
      this.fieldTypes[id] = new SvelteCMSFieldType(id, conf)
    })
    Object.entries(widgetTypes).forEach(([id,conf]) => {
      this.widgetTypes[id] = new SvelteCMSWidgetType(id, conf)
    })

    // TODO: find all plugins

    // Build out config for the content types
    Object.entries(conf?.types).forEach(([id,conf]) => {
      this.types[id] = new SvelteCMSContentType(id, conf, this)
    })

  }
}

