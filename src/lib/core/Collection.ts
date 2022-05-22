import type { FieldableEntityConfigSetting, EntityType, FieldableEntity } from "sveltecms"
import type SvelteCMS from "sveltecms"
import Field, { type FieldConfigSetting } from "./Field"


export type CollectionConfigSetting = FieldableEntityConfigSetting & EntityType & {
  admin?:boolean
}
export type AdminCollectionConfigSetting = CollectionConfigSetting & { admin:true }

export class Collection implements EntityType, FieldableEntity {
  id:string
  type:string
  admin?:boolean
  isFieldable=true
  fields:{[id:string]:Field}
  constructor(conf:CollectionConfigSetting, cms:SvelteCMS) {
    this.id = conf.id
    this.admin = conf.admin
    this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id,conf]) => {
      return [id, new Field(id, conf, cms)]
    }))
  }
}
export type AdminCollection = Collection & { admin:true }

export const collectionTypes = [
  {
    id: 'base',
    fields: {},
  },
]

export default Collection