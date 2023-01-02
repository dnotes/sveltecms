import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, TypedEntity, DisplayableEntity, DisplayableEntityConfigSetting } from "sveltecms"
import type SvelteCMS from "sveltecms"
import type { EntityDisplayConfigSetting } from "./Display"
import type { EntityTemplate } from "./EntityTemplate"
import Field, { type ConfigFieldConfigSetting, type FieldConfigSetting } from "./Field"

export type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & DisplayableEntityConfigSetting & {
  admin?:boolean
  tags?:string|string[]
}
export type AdminFieldgroupConfigSetting = FieldgroupConfigSetting & {
  admin:true
  fields:{[id:string]:ConfigFieldConfigSetting}
}

export const templateFieldgroup:EntityTemplate = {
  id: 'fieldgroup',
  label: 'Fieldgroup',
  labelPlural: 'Fieldgroups',
  description: `A Fieldgroup is a group of Fields which may be displayed by a Component.`,
  typeField: false,
  isConfigurable: true,
  isDisplayable: true,
  isFieldable: true,
  listFields: ['tags'],
  configFields: {
    tags: {
      type: 'text',
      multiple: true,
      default: [],
      helptext: 'Fields with "Use Components" checked can specify which Fieldgroups may be chosen by ID or by Tags.',
      widget: {
        type: 'options',
        items: ['fullwidth', 'block', 'inline'],
        oneline: true,
      }
    }
  }
}

export class Fieldgroup implements EntityType, FieldableEntity, DisplayableEntity {
  id:string
  tags:string[] = []
  admin?:boolean
  plugin?:string
  displays:EntityDisplayConfigSetting
  isFieldable=true
  fields:{[id:string]:Field}
  constructor(conf:string|FieldgroupConfigSetting, cms:SvelteCMS) {
    conf = typeof conf === 'string' ? cms.fieldgroups[conf] : conf
    this.id = conf.id
    this.admin = conf.admin
    if (conf.tags) this.tags = typeof conf.tags === 'string' ? conf.tags.split(/[\s,]+/) : conf.tags
    this.displays = { default:'div', ...cms.parseEntityDisplayConfigSetting(conf.displays) }
    this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id,conf]) => {
      return [id, new Field(id, conf, cms)]
    }))
  }
}
export type AdminFieldgroup = Fieldgroup & { admin:true }

export default Fieldgroup