import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, TypedEntity, DisplayableEntity, DisplayableEntityConfigSetting } from "sveltecms"
import type SvelteCMS from "sveltecms"
import type { DisplayConfigSetting } from "./Display"
import type { EntityTemplate } from "./EntityTemplate"
import Field, { type ConfigFieldConfigSetting, type FieldConfigSetting } from "./Field"

export type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & DisplayableEntityConfigSetting & {
  admin?:boolean
  type?:string
}
export type AdminFieldgroupConfigSetting = FieldgroupConfigSetting & {
  admin:true
  fields:{[id:string]:ConfigFieldConfigSetting}
}

export const templateFieldgroup:EntityTemplate = {
  id: 'fieldgroup',
  label: 'Field Group',
  labelPlural: 'Field Groups',
  description: `A Field Group is a group of Fields.`,
  typeField: true,
  typeInherits: true,
  isConfigurable: true,
  isFieldable: true,
  configFields: {
    display: {
      type:'entity',
      default:'',
      helptext:'The element or component used to display this fieldgroup.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'display',
        },
      }
    },
    displayModes: {
      type:'entityList',
      default:{},
      helptext:'Display configurations which override the default display for a display mode. '+
        'Display modes used by SvelteCMS include: "page", "teaser", and "reference".',
      widget: {
        type: 'entityList',
        options: {
          entityType: 'display',
        }
      }
    },
  }
}
export class Fieldgroup implements EntityType, FieldableEntity, DisplayableEntity {
  id:string
  type:string
  admin?:boolean
  plugin?:string
  display?:string|false|DisplayConfigSetting
  displayModes:{[key:string]:string|false|DisplayConfigSetting}
  isFieldable=true
  fields:{[id:string]:Field}
  constructor(conf:string|FieldgroupConfigSetting, cms:SvelteCMS) {
    conf = typeof conf === 'string' ? cms.fieldgroups[conf] : conf
    this.id = conf.id
    this.admin = conf.admin
    this.type = conf.type || conf.id
    this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id,conf]) => {
      return [id, new Field(id, conf, cms)]
    }))
  }
}
export type AdminFieldgroup = Fieldgroup & { admin:true }

export default Fieldgroup