import type {
  SvelteCMSConfigSetting,
  SvelteCMSContentTypeConfigSetting,
  SvelteCMSContentFieldConfigSetting,
  SvelteCMSSlugConfigSetting
} from "./global"
import type { OptionsSlugify, OptionsTransliterate } from "transliteration/dist/node/src/types"
import type { SvelteComponent } from "svelte/internal"
import getLabelFromID from "./utils/getLabelFromID"

const splitter = /\s*,\s/g

export class SvelteCMSSlugConfig {
  fields: string[]
  slugify: boolean|OptionsSlugify = {}
  transliterate: boolean|OptionsTransliterate = {}
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

export class SvelteCMSContentTypeConfig {
  id:string
  title:string = ''
  slug:SvelteCMSSlugConfig
  fields:{[key:string]:SvelteCMSContentFieldConfig} = {}
  constructor(id, conf:SvelteCMSContentTypeConfigSetting) {
    this.id = id
    this.title = conf.title
    this.slug = new SvelteCMSSlugConfig(this.slug)
    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new SvelteCMSContentFieldConfig(id, conf)
    })
  }
}

export class SvelteCMSContentFieldConfig {
  id: string
  type: string
  title: string
  required: boolean
  disabled: boolean
  multiple?: boolean
  minValues?: number
  maxValues?: number
  fields:{[key:string]:SvelteCMSContentFieldConfig} = {}
  widget: Promise<SvelteComponent>
  options?: {[key:string]:any}
  constructor(id, conf:string|SvelteCMSContentFieldConfigSetting) {
    let widget
    this.id = id
    if (typeof conf === 'string') {
      this.type = conf
      this.title = getLabelFromID(id)
      this.required = false
      this.disabled = false
      widget = this.type
    }
    else {
      this.type = conf.type
      this.title = conf.title ?? getLabelFromID(id)
      this.multiple = conf.multiple ?? undefined
      this.minValues = conf.minValues ?? undefined
      this.maxValues = conf.maxValues ?? undefined
      this.required = conf.required ? true : false
      this.disabled = conf.disabled ? true : false
      this.options = conf.options ?? undefined
      if (conf.fields) {
        Object.entries(conf.fields).forEach(([id, conf]) => {
          this.fields[id] = new SvelteCMSContentFieldConfig(id, conf)
        })
      }
      widget = conf.widget ?? this.type
    }
    if (typeof widget === 'string') {
      let [widgetModule,widgetName] = widget.split('.')
      let widgetImport
      if (!widgetName) {
        widgetName = widgetModule.charAt(0).toUpperCase() + widgetModule.slice(1)
        widgetImport = import(/* @vite-ignore */`./widgets/CMSWidget${widgetName}.svelte`)
          .then(module => { return module.default })
      }
      else {
        widgetImport = import(/* @vite-ignore */`${widgetModule}/${widgetName}.svelte`).then(module => {
          if (!module[widgetName]) throw new Error(`No widget found for ${this.title}`)
          console.log(JSON.stringify(module))
          return module[widgetName]
        })
      }
      this.widget = widgetImport
    }
    else {
      this.widget = Promise.resolve(this.widget)
    }
  }
}

export default class SvelteCMSConfig {
  types:{[key:string]:SvelteCMSContentTypeConfig} = {}
  lists:{[key:string]: Array<string|number|{id:string|number,value:any}>} = {}
  constructor(conf:SvelteCMSConfigSetting) {
    Object.entries(conf?.types).forEach(([id,conf]) => {
      this.types[id] = new SvelteCMSContentTypeConfig(id, conf)
    })
    Object.entries(conf?.lists).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    })
  }
}

