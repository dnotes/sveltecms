/// <reference types="@sveltejs/kit" />

import type { SvelteCMSContentField, SvelteCMSContentType } from "$lib"
import type { SvelteComponent, SvelteComponentDev } from "svelte/internal"
import type { Rules } from 'validatorjs'

/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export type ConfigSetting = {[key:string]: string|number|boolean|ConfigSetting|Array<string|number|ConfigSetting>}

export type SvelteCMSPlugin = {
  fieldTypes?: SvelteCMSFieldType[]
  widgetTypes?: SvelteCMSWidgetType[]
  transformers?: SvelteCMSFieldTransformer[]
  contentStores?: SvelteCMSContentStore[]
  mediaStores?: SvelteCMSMediaStore[]
  lists?: SvelteCMSListConfig
  optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
}

export type SvelteCMSPluginBuilder = (config:any) => SvelteCMSPlugin

export type SvelteCMSListConfig = {[key:string]: Array<string|number|{id:string|number,value:any}>}

export type SvelteCMSFieldFunctionSetting = {
  id:string,
  options:ConfigSetting
}

export type SvelteCMSFieldFunctionConfig = SvelteCMSFieldFunctionSetting & {
  module:string,
}

export type SvelteCMSStoreConfigSetting = ConfigSetting & {
  id:string
}

export type SvelteCMSConfigSetting = {
  types?: {[key:string]: SvelteCMSContentTypeConfigSetting}
  lists?: {[key:string]: string|(string|number|{id:string|number, value:ConfigSetting})[]}
  contentStores?: {[key:string]: SvelteCMSContentStoreConfigSetting}
  mediaStores?: {[key:string]: SvelteCMSMediaStoreConfigSetting}
  widgetTypes?: {[key:string]: SvelteCMSWidgetTypeConfigSetting}
  transformers?: {[key:string]: SvelteCMSFieldFunctionSetting}
}

export type SvelteCMSContentTypeConfigSetting = {
  title: string
  slug?: string|string[]|SvelteCMSSlugConfigSetting
  fields: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  contentStore: string|SvelteCMSStoreConfigSetting
  mediaStore: string|SvelteCMSStoreConfigSetting
}

export type SvelteCMSContentFieldConfigSetting = {
  type: string
  title?: string
  default?: any
  description?: string
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  minValues?: number
  maxValues?: number
  fields?: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  widget?: string|SvelteCMSWidgetTypeConfigSetting
  widgetOptions?: ConfigSetting
  validator?: Rules
  preSave?: string|SvelteCMSFieldFunctionSetting|(string|SvelteCMSFieldFunctionSetting)[]
  preMount?: string|SvelteCMSFieldFunctionSetting|(string|SvelteCMSFieldFunctionSetting)[]
  class?: string
}

export type SvelteCMSConfigFieldConfigSetting = SvelteCMSContentFieldConfigSetting & {
  type: 'text'|'number'|'boolean'|'date'|'choice'|'collection'|'tags'|'cmsfield'
  default: any
  fields?: {[key:string]:SvelteCMSConfigFieldConfigSetting}
}

export type SvelteCMSSlugConfigSetting = {
  fields: string|string[]
  slugify: boolean|OptionsSlugify
  transliterate: boolean|OptionsTransliterate
}

export type SvelteCMSMedia = {
  src:string,
  alt?:string,
  title?:string,
}

export type SvelteCMSContentStoreType = {
  id:string
  getContent?:(contentType:SvelteCMSContentType, opts:ConfigSetting, slug?:string|number) => Promise<any>
  saveContent?:(content:any, contentType:SvelteCMSContentType, opts:ConfigSetting) => Promise<any>
  deleteContent?:(content:any, contentType:SvelteCMSContentType, opts:ConfigSetting) => Promise<any>
  optionFields?: {[key:string]:SvelteCMSConfigFieldConfigSetting}
  options?: ConfigSetting
}

export type SvelteCMSMediaStoreType = {
  id:string
  saveMedia:(files:any, contentType:SvelteCMSContentType, field:SvelteCMSContentField) => Promise<any>
  deleteMedia:(files:any, contentType:SvelteCMSContentType, field:SvelteCMSContentField) => Promise<any>
  optionFields?: {[key:string]:SvelteCMSConfigFieldConfigSetting}
  options?: ConfigSetting
}

export class SvelteCMSFieldType {
  id:string
  defaultValue:any
  defaultWidget:string|SvelteCMSWidgetTypeConfigSetting
  defaultValidator?:Rules
  defaultPreSave?:Array<string|SvelteCMSFieldFunctionSetting>
  defaultPreMount?:Array<string|SvelteCMSFieldFunctionSetting>
  hidden?:boolean
  // constructor(id,conf:SvelteCMSFieldTypeConfig) {
  //   this.id = id
  //   this.defaultValue = conf.defaultValue
  //   this.defaultWidget = conf.defaultWidget
  //   // @ts-ignore
  //   if (conf?.defaultTransform) this.defaultTransform = conf.defaultTransform
  // }
  // merge(conf:SvelteCMSFieldTypeConfigMerge):void {
  //   if (conf.hasOwnProperty('defaultValue')) this.defaultValue = conf.defaultValue
  //   if (conf.hasOwnProperty('defaultWidget')) this.defaultWidget = conf.defaultWidget
  // }
}

export type SvelteCMSFieldTypeMerge = {
  id:string
  defaultValue?:any
  defaultWidget?:string

}

export type SvelteCMSWidgetType = {
  id:string
  widget:Object
  fieldTypes:string[]
  handlesMultiple?:boolean
  optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
  hidden?:boolean
}

export type SvelteCMSWidgetTypeMerge = {
  id:string
  fieldTypes?:string[]
}

export type SvelteCMSWidgetTypeConfigSetting = {
  id:string
  options:ConfigSetting
}

export type SvelteCMSFieldTransformer = {
  id:string,
  fn:(value:any,opts:ConfigSetting,fieldConf:SvelteCMSFieldType) => any
  optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
  noBrowser?:boolean
  noServer?:boolean
  [key:string]:any
}

// export type SvelteCMSFieldValidator = {
//   id:string
//   fn:(value:any,opts:ConfigSetting,fieldConf:SvelteCMSFieldInstance) => string|Error|void
//   optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
//   noBrowser?:boolean
//   noServer?:boolean
// }
