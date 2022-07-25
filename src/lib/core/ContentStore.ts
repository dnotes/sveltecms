import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms'
import type { ContentType } from 'sveltecms/core/ContentType'
import type { EntityTemplate } from 'sveltecms/core/EntityTemplate'

const noStore = async () => {
  // @ts-ignore
  console.error(`Store not found: (${this?.['id'] || ''})`)
  return {}
}

export type Value = string|number|boolean|null|undefined|Date|Content|Array<Value>
export type Content = {
  _type?:string
  _slug?:string
  _oldSlug?:string
  [id:string]:Value
}

export type ContentStoreType = EntityType & ConfigurableEntityType & {
  listContent?:(contentType:ContentType, opts:ConfigSetting) => Promise<Content[]>
  getContent?:(contentType:ContentType, opts:ConfigSetting, slug?:string|number) => Promise<Content|Content[]>
  saveContent?:(content:Content, contentType:ContentType, opts:ConfigSetting) => Promise<Content>
  deleteContent?:(content:Content, contentType:ContentType, opts:ConfigSetting) => Promise<Content>
}

export type ContentStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting

export const templateContentStore:EntityTemplate = {
  id: 'contentStore',
  label: 'Content Store',
  labelPlural: 'Content Stores',
  description: `A Content Store connects with some type of database or file system to provide storage for content managed by SvelteCMS.`,
  typeField: true,
  typeInherits: true,
  typeRequired: true,
  typeRestricted: true,
  isConfigurable: true,
}

export class ContentStore implements ConfigurableEntity, TypedEntity {
  id:string
  type:string
  listContent:(contentType:ContentType, options:ConfigSetting)=>Promise<Content[]>
  getContent:(contentType:ContentType, options:ConfigSetting, slug?:string|number)=>Promise<Content|Content[]>
  saveContent:(content:Content, contentType:ContentType, options:ConfigSetting)=>Promise<Content>
  deleteContent:(content:Content, contentType:ContentType, options:ConfigSetting)=>Promise<Content>
  options:ConfigSetting
  constructor(conf:string|ContentStoreConfigSetting, cms:SvelteCMS) {
    if (!conf) conf = { type:'staticFiles' }
    else if (typeof conf === 'string') conf = { type:conf }
    let store = cms.contentStores[conf?.type] || cms.contentStores[conf?.id]
    if (!store) store = Object.values(cms.contentStores)[0]
    this.id = store.id
    this.type = conf.type
    this.listContent = store?.listContent || (async () => { console.error(`Store not found: (${this?.['id']})`); return []; })
    this.getContent = store?.getContent || noStore
    this.saveContent = store?.saveContent || noStore
    this.deleteContent = store?.deleteContent || noStore
    this.options = cms.getInstanceOptions(store, conf)
  }
}

export default ContentStore