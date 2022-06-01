import type { ComponentType } from "sveltecms/core/Component"
import type { ConfigurableEntityConfigSetting } from "sveltecms"

import Content from "sveltecms/display/Content.svelte"
import Field from "sveltecms/display/Content.svelte"
import Image from "sveltecms/display/field/Image.svelte"
import File from "sveltecms/display/field/File.svelte"
import Element from "sveltecms/display/field/Element.svelte"
import Fieldgroup from "sveltecms/display/field/Fieldgroup.svelte"
import type SvelteCMS from "sveltecms"

export type DisplayConfigSetting = ConfigurableEntityConfigSetting & {
  type: string      // either the html element for svelte:element, or a registered component
  wrapper?: string|DisplayConfigSetting  // the wrapper element or registered component
  html?: boolean    // whether or not the item should be wrapped in @html
}

export class DisplayConfig  {
  type: string
  isComponent: boolean
  wrapper?: DisplayConfig
  html?: boolean
  constructor(conf:string|DisplayConfigSetting, cms:SvelteCMS) {
    if (!conf) return
    conf = typeof conf === 'string' ? { type:conf } : conf
    this.type = conf.type
    this.isComponent = cms.components[this.type] ? true : false
    this.html = conf?.html
    if (conf.wrapper) this.wrapper = new DisplayConfig(conf.wrapper, cms)
  }
}

export const displayComponents:ComponentType[] = [
  { id: 'content', component: Content },
  { id: 'field', component: Field },
  { id: 'field_element', component: Element },
  { id: 'field_image', component: Image },
  { id: 'field_file', component: File },
  { id: 'field_fieldgroup', component: Fieldgroup },
]
