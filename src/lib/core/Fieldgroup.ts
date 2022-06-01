import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, TypedEntity } from "sveltecms"
import type SvelteCMS from "sveltecms"
import Field, { type ConfigFieldConfigSetting, type FieldConfigSetting } from "./Field"

const configFieldgroup:AdminFieldgroupConfigSetting = {
  id: 'configFieldgroup',
  type: 'config',
  admin: true,
  fields: {
    id: {
      type: 'text',
      label: 'ID',
      default: '',
      helptext: 'The ID for the fieldgroup',
      disabled: '$equal($value,$values.type)',
    },
    type: {
      type: 'text',
      default: '',
      helptext: 'The type of fieldgroup. To create a new type, leave this blank and it will be the same as the ID. '+
                'The fieldgroup "type" is used to filter options when content editors can choose a field fieldgroup.',
      widget: {
        type: 'select',
        options: {
          items: '$listEntities(fieldgroup)',
          unset: '- new type -'
        }
      }
    },
  }
}

export type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & {
  admin?:boolean
  type?:string
}
export type AdminFieldgroupConfigSetting = FieldgroupConfigSetting & {
  admin:true
  fields:{[id:string]:ConfigFieldConfigSetting}
}
export class Fieldgroup implements EntityType, FieldableEntity {
  id:string
  type:string
  admin?:boolean
  plugin?:string
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

export const fieldgroups = [
  {
    id: 'block',
    fields: {},
  },
  {
    id: 'field',
    fields: {},
  },
  {
    id: 'config',
    admin: true,
    fields: {},
  }
]

export default Fieldgroup