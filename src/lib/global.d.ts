/// <reference types="@sveltejs/kit" />

import type { SvelteCMSFieldTransformFunction } from "$lib"
import type { SvelteComponent } from "svelte/internal"
import type { OptionsSlugify, OptionsTransliterate } from "transliteration/dist/node/src/types"

export type SvelteCMSConfigSetting = {
  types?: {[key:string]: SvelteCMSContentTypeConfigSetting}
  lists?: {[p:string]: string|Array<string|number|{id:string|number,value:any}>}
}

export type SvelteCMSContentTypeConfigSetting = {
  title: string
  slug?: string|string[]|SvelteCMSSlugConfigSetting
  fields: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
}

export type SvelteCMSContentFieldConfigSetting = {
  type: string
  title?: string
  description?: string
  default?: any
  multiple?: boolean
  minValues?: number
  maxValues?: number
  required?: boolean
  disabled?: boolean
  fields?: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  widget?: string|SvelteComponent
  options?: {[key:string]:any}
}

export type SvelteCMSSlugConfigSetting = {
  fields: string|string[]
  slugify: boolean|OptionsSlugify
  transliterate: boolean|OptionsTransliterate
}

export type SvelteCMSFieldTypeConfig = {
  defaultValue:any,
  defaultWidget:string,
  defaultTransform?:SvelteCMSFieldTransformFunction
}
export type SvelteCMSFieldTypeConfigMerge = {
  defaultValue?:any
  defaultWidget?:string
  // @TODO: defaultTransform?:string
}

export type SvelteCMSWidgetTypeConfig = {
  fieldTypes:string|string[],
  transforms?:{[id:string]:SvelteCMSFieldTransformFunction}
  options?:{[id:string]:any}
}
export type SvelteCMSWidgetTypeConfigMerge = {
  fieldTypes?:string[]
  // @TODO: transforms?:string
}

export type SvelteCMSMedia = {
  src:string,
  alt?:string,
  title?:string,
}

export type SvelteCMSWidgeTextOptions = {
  placeholder?:string
}

export type SvelteCMSWidgetNumberOptions = {
  min?:number
  max?:number
}

export type SvelteCMSWidgetRangeOptions = {
  min?:number
  max?:number
  step?:number
}
