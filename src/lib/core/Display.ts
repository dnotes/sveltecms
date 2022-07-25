import type { Component, ComponentType } from "sveltecms/core/Component"
import type { ConfigurableEntityConfigSetting } from "sveltecms"

import Image from "sveltecms/display/field/Image.svelte"
import File from "sveltecms/display/field/File.svelte"
import Fieldgroup from "sveltecms/display/field/Fieldgroup.svelte"
import Reference from "sveltecms/display/field/Reference.svelte"
import type SvelteCMS from "sveltecms"
import type { EntityTemplate } from "./EntityTemplate"

export type DisplayConfigSetting = ConfigurableEntityConfigSetting & {
  type: string      // either the html element for svelte:element, or a registered component
  wrapper?: string  // the wrapper element or registered component
  html?: boolean    // if true, the item will be displayed as {@html}
  link?: boolean    // if true, the item will be wrapped in a link
}

export const templateDisplay:EntityTemplate = {
  id: 'display',
  label: 'Display',
  labelPlural: 'Displays',
  description: 'A Display configuration determines how SvelteCMS will display a field by default.',
  typeField: true,
  configFields: {
    type: {
      type: 'text',
      default: '',
      helptext: 'An HTML element (p, li, etc.) or include path for a SvelteCMS Component to use when displaying the field.',
    },
    wrapper: {
      type: 'text',
      default: '',
      helptext: 'An HTML element (div, ul, etc.) or include path for a SvelteCMS Component to use as a wrapper for the displayed field.',
    },
    html: {
      type: 'boolean',
      default: false,
      helptext: `Whether to treat the field value as pre-sanitized HTML. `+
      `NOTE! Unless the user input for the field is sanitized with `+
      `an appropriate and properly configured preMount Transformer, `+
      `using this feature is a critical security vulnerability.`
    },
    link: {
      type: 'boolean',
      default: false,
      helptext: `Whether to display the field value as a link to its parent Content.`
    },
  }
}

export class Display {
  type: string = ''
  isDisplayed: boolean = false
  link: boolean = false
  component?: Component
  wrapper?: Display

  // properties that only apply to an element
  html?: boolean
  tag?: string
  id?: string
  classes?: string[]

  constructor(conf:string|false|undefined|DisplayConfigSetting, cms:SvelteCMS) {
    if (!conf) return
    conf = typeof conf === 'string' ? { type:conf } : conf
    if (!conf.type || ['none','hidden'].includes(conf.type)) return
    this.isDisplayed = true
    this.type = conf.type.trim()
    this.component = cms.getEntity('component', this.type)
    this.link = conf.link ? true : false
    if (!this.component) {
      this.html = conf?.html
      let el, classes, tag, id
      [el, ...classes] = this.type.split('.');
      this.classes = classes;
      [tag, id] = el.split('#');
      this.tag = tag
      this.id = id
    }
    if (conf.wrapper) this.wrapper = new Display(conf.wrapper, cms)
  }

  get classList() { return this.classes.join(' ') }

}

export const displayComponents:ComponentType[] = [
  { id: 'field_image', component: Image },
  { id: 'field_file', component: File },
  { id: 'field_fieldgroup', component: Fieldgroup },
  { id: 'field_reference', component: Reference },
]
