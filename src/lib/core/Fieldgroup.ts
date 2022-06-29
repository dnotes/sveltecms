import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, TypedEntity } from "sveltecms"
import type SvelteCMS from "sveltecms"
import { Entity, type EntityTemplate } from "./EntityTemplate"
import Field, { type ConfigFieldConfigSetting, type FieldConfigSetting } from "./Field"

export type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & {
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
}
export class Fieldgroup extends Entity implements EntityType, FieldableEntity {
  template=templateFieldgroup
  id:string
  type:string
  admin?:boolean
  plugin?:string
  isFieldable=true
  fields:{[id:string]:Field}
  constructor(conf:string|FieldgroupConfigSetting, cms:SvelteCMS) {
    super(templateFieldgroup)
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