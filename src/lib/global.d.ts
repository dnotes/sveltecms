/// <reference types="@sveltejs/kit" />

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
  multiple?: boolean
  minValues?: number
  maxValues?: number
  required?: boolean
  disabled?: boolean
  widget?: string|SvelteComponent
  fields?: {[key:string]:string|SvelteCMSContentFieldConfigSetting}
  options?: Record
}

export type SvelteCMSSlugConfigSetting = {
  fields: string|string[]
  slugify: boolean|OptionsSlugify
  transliterate: boolean|OptionsTransliterate
}
