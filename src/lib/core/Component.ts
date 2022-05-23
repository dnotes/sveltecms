import type SvelteCMS from "sveltecms";
import type { ConfigurableEntityConfigSetting, ConfigurableEntityType, TypedEntityConfigSetting, ConfigurableEntity, ConfigSetting, TypedEntity, EntityType } from "sveltecms";

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
