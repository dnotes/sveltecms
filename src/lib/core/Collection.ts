import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, TypedEntity } from "sveltecms"
import type SvelteCMS from "sveltecms"
import Field, { type ConfigFieldConfigSetting, type FieldConfigSetting } from "./Field"

const configCollection:AdminCollectionConfigSetting = {
  id: 'configCollection',
  type: 'config',
  admin: true,
  fields: {
    id: {
      type: 'text',
      label: 'ID',
      default: '',
      helptext: 'The ID for the collection',
      disabled: '$equal($value,$values.type)'
    },
    type: {
      type: 'text',
      default: '',
      helptext: 'The type of collection. To create a new type, leave this blank and it will be the same as the ID. '+
                'The collection "type" is used to filter options when content editors can choose a field collection.',
      widget: {
        type: 'select',
        options: {
          items: '$listEntities(collection)',
          unset: '- new type -'
        }
      }
    },
  }
}

export type CollectionConfigSetting = FieldableEntityConfigSetting & EntityType & {
  admin?:boolean
  type?:string
}
export type AdminCollectionConfigSetting = CollectionConfigSetting & {
  admin:true
  fields:{[id:string]:ConfigFieldConfigSetting}
}
export class Collection implements EntityType, FieldableEntity {
  id:string
  type:string
  admin?:boolean
  plugin?:string
  isFieldable=true
  fields:{[id:string]:Field}
  constructor(conf:string|CollectionConfigSetting, cms:SvelteCMS) {
    conf = typeof conf === 'string' ? cms.collections[conf] : conf
    this.id = conf.id
    this.admin = conf.admin
    this.type = conf.type || conf.id
    this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id,conf]) => {
      return [id, new Field(id, conf, cms)]
    }))
  }
}
export type AdminCollection = Collection & { admin:true }

export const collectionTypes = [
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

export default Collection