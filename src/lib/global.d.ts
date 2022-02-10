/// <reference types="@sveltejs/kit" />

import type { SvelteCMSContentField, SvelteCMSContentType } from "."
import type { SvelteComponent, SvelteComponentDev } from "svelte/internal"
import type { Rules } from 'validatorjs'

/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export type ConfigSetting = {[key:string]: string|number|boolean|null|undefined|ConfigSetting|Array<ConfigSetting>}

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

export type SvelteCMSFieldFunctionType = {
  id:string,
  // TODO: integrate event and el into field functions. See CMSEditorForm.svelte.
  fn:(vars:{ field:SvelteCMSContentField, values:any, errors:any, touched:any, id?:string }, opts:{[key:string]:any}, event?:Event, el?:HTMLElement) => any
  optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
}

export type SvelteCMSFieldFunctionConfigParam = (string|number|boolean|null|SvelteCMSFieldFunctionConfigSetting)[]
export type SvelteCMSFieldFunctionConfigSetting = {
  function?: string
  fn?: string
  params: (string|number|boolean|null|SvelteCMSFieldFunctionConfigSetting)[]
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
  label: string
  slug?: string|string[]|SvelteCMSSlugConfigSetting
  fields: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  contentStore: string|SvelteCMSStoreConfigSetting
  mediaStore: string|SvelteCMSStoreConfigSetting
}

export type SvelteCMSContentFieldConfigSetting = {
  type: string
  label?: string
  default?: any
  value?: any
  tooltip?: string
  required?: boolean|SvelteCMSFieldFunctionConfigSetting
  disabled?: boolean|SvelteCMSFieldFunctionConfigSetting
  hidden?: boolean|SvelteCMSFieldFunctionConfigSetting
  collapsible?:boolean|SvelteCMSFieldFunctionConfigSetting
  collapsed?:boolean|SvelteCMSFieldFunctionConfigSetting
  multiple?: boolean|SvelteCMSFieldFunctionConfigSetting|{
    label?:boolean|SvelteCMSFieldFunctionConfigSetting
    min?: number|SvelteCMSFieldFunctionConfigSetting
    max?: number|SvelteCMSFieldFunctionConfigSetting
  }
  multipleLabel?: string|SvelteCMSFieldFunctionConfigSetting
  multipleMin?: number|SvelteCMSFieldFunctionConfigSetting
  multipleMax?: number|SvelteCMSFieldFunctionConfigSetting
  fields?: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  widget?: string|SvelteCMSWidgetTypeConfigSetting
  widgetOptions?: ConfigSetting
  validator?: Rules
  preSave?: string|SvelteCMSFieldFunctionSetting|(string|SvelteCMSFieldFunctionSetting)[]
  preMount?: string|SvelteCMSFieldFunctionSetting|(string|SvelteCMSFieldFunctionSetting)[]
  class?: string
  events?: {on:string,function:SvelteCMSFieldFunctionConfigSetting}|{on:string,function:SvelteCMSFieldFunctionConfigSetting}[]
}

export type SvelteCMSConfigFieldConfigSetting = SvelteCMSContentFieldConfigSetting & {
  type: 'text'|'number'|'boolean'|'date'|'choice'|'collection'|'tags'|'cmsField'|'cmsTransformer'|'cmsFunction'
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
  listContent?:(contentType:SvelteCMSContentType, opts:ConfigSetting) => Promise<any[]>
  getContent?:(contentType:SvelteCMSContentType, opts:ConfigSetting, slug?:string|number) => Promise<any>
  saveContent?:(content:any, contentType:SvelteCMSContentType, opts:ConfigSetting) => Promise<any>
  deleteContent?:(content:any, contentType:SvelteCMSContentType, opts:ConfigSetting) => Promise<any>
  optionFields?: {[key:string]:SvelteCMSConfigFieldConfigSetting}
  options?: ConfigSetting
}

export type SvelteCMSMediaStoreType = {
  id:string
  listMedia?:(path:string|null, opts:ConfigSetting) => Promise<string[]>
  getMedia?:(filename:string|number|null, opts:ConfigSetting) => Promise<string>
  saveMedia?:(file:File, opts:ConfigSetting) => Promise<any>
  deleteMedia?:(filename:string, opts:ConfigSetting) => Promise<any>
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
  defaultPreForm?:Array<string|SvelteCMSFieldFunctionSetting>
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
  handlesMedia?:boolean
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

export type SvelteCMSFieldTransformerSetting = {
  id: string,
  options: ConfigSetting
}

// export type SvelteCMSFieldValidator = {
//   id:string
//   fn:(value:any,opts:ConfigSetting,fieldConf:SvelteCMSFieldInstance) => string|Error|void
//   optionFields?:{[key:string]:SvelteCMSConfigFieldConfigSetting}
//   noBrowser?:boolean
//   noServer?:boolean
// }
