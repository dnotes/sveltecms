import type { ComponentType } from "sveltecms/core/Component"
import type { ConfigurableEntityConfigSetting } from "sveltecms"

import Content from "sveltecms/display/Content.svelte"
import Field from "sveltecms/display/Content.svelte"
import Image from "sveltecms/display/field/Image.svelte"
import File from "sveltecms/display/field/File.svelte"
import Element from "sveltecms/display/field/Element.svelte"
import Collection from "sveltecms/display/field/Collection.svelte"

export type DisplayConfigSetting = ConfigurableEntityConfigSetting & {
  type: string      // either the html element for svelte:element, or a registered component
  wrapper?: string  // the wrapper element or registered component
  html?: boolean    // whether or not the item should be wrapped in @html
}

export const displayComponents:ComponentType[] = [
  { id: 'content', component: Content },
  { id: 'field', component: Field },
  { id: 'field_element', component: Element },
  { id: 'field_image', component: Image },
  { id: 'field_file', component: File },
  { id: 'field_collection', component: Collection },
]
