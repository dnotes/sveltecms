import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms'
import type { ContentType } from 'sveltecms/core/ContentType'

const noStore = async () => {
  // @ts-ignore
  console.error(`Store not found: (${this?.['id'] || ''})`)
}

export type ContentStoreType = EntityType & ConfigurableEntityType & {
  listContent?:(contentType:ContentType, opts:ConfigSetting) => Promise<any[]>
  getContent?:(contentType:ContentType, opts:ConfigSetting, slug?:string|number) => Promise<any|any[]>
  saveContent?:(content:any, contentType:ContentType, opts:ConfigSetting) => Promise<any>
  deleteContent?:(content:any, contentType:ContentType, opts:ConfigSetting) => Promise<any>
}

export type ContentStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting

export class ContentStore implements ConfigurableEntity, TypedEntity {
  id:string
  type:string
  listContent:(contentType:ContentType, options:ConfigSetting)=>Promise<any[]>
  getContent:(contentType:ContentType, options:ConfigSetting, slug?:string|number)=>Promise<any|any[]>
  saveContent:(content:any, contentType:ContentType, options:ConfigSetting)=>Promise<any>
  deleteContent:(content:any, contentType:ContentType, options:ConfigSetting)=>Promise<any>
  options:ConfigSetting
  constructor(conf:string|ContentStoreConfigSetting, cms:SvelteCMS) {
    let store = typeof conf === 'string' ? cms.contentStores[conf] : (cms.contentStores[conf?.type] || cms.contentStores[conf?.id])
    if (!store) store = Object.values(cms.contentStores)[0]
    this.id = store?.id
    this.listContent = store?.listContent || (async () => { console.error(`Store not found: (${this?.['id']})`); return []; })
    this.getContent = store?.getContent || noStore
    this.saveContent = store?.saveContent || noStore
    this.deleteContent = store?.deleteContent || noStore
    this.options = cms.getInstanceOptions(store, conf)
  }
}

export default ContentStore