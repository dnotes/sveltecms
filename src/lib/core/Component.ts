import type SvelteCMS from "sveltecms";
import type { ConfigurableEntityConfigSetting, ConfigurableEntityType, TypedEntityConfigSetting, ConfigurableEntity, ConfigSetting, TypedEntity, EntityType } from "sveltecms";
import type { EntityTemplate } from "./EntityTemplate";

/**
 * Note: Components must be pre-registered for ANY type of import in SvelteKit.
 * Dynamic import() cannot be used with a variable in the import string; this
 * is a limitation of the bundler. See https://github.com/sveltejs/svelte/issues/6702.
 */

export const templateComponent:EntityTemplate = {
  id: 'component',
  label: 'Component',
  labelPlural: 'Components',
  description: `Components are .svelte files used to display content. Some are provided by plugins, but they can also be created by developers for a particular app or website.`,
  typeField: true,
  typeInherits: true,
  typeRestricted: true,
  isConfigurable: true,
}

export type ComponentType = EntityType & ConfigurableEntityType & {
  component:Object // TODO: find type for svelte component
}

export type ComponentConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting

export class Component implements ConfigurableEntity, TypedEntity {
  id: string
  type: string
  component: Object
  plugin?:string
  options?: ConfigSetting
  constructor(conf:string|ComponentConfigSetting, cms:SvelteCMS) {
    let componentType = typeof conf === 'string' ? cms.components[conf] : (cms.components[conf?.type] || cms.components[conf?.id])
    if (!componentType) throw new Error(`Component type not found for ${conf?.['id'] || conf?.['type'] || conf}`)
    this.id = componentType.id
    this.type = componentType.id
    this.component = componentType.component
    this.options = cms.getInstanceOptions(componentType, conf)
  }
}

export default Component
