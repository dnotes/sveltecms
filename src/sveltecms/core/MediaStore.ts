import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms'
import type { Value } from './ContentStore'
import type { EntityTemplate } from './EntityTemplate'
import type { AdminFieldgroupConfigSetting } from './Fieldgroup'

export type Media = {
  src:string
  _meta?:MediaMetadata
  [fieldname:string]:Value
}
export type MediaMetadata = {
  name?:string
  type?:string
  date?:Date
  size?:number
  [key:string]:Value
}
export type MediaIndex = {
  usage:string,
  value:Media,
}[]

export type MediaStoreType = EntityType & ConfigurableEntityType & {
  listMedia?:(path:string|null, opts:ConfigSetting) => Promise<string[]>
  getMedia?:(filename:string|number|null, opts:ConfigSetting) => Promise<string|string[]>
  saveMedia?:(file:File, opts:ConfigSetting) => Promise<string>
  deleteMedia?:(filename:string, opts:ConfigSetting) => Promise<any>
  immediateUpload?:boolean
}

export type MediaStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting

export const templateMediaStore:EntityTemplate = {
  id: 'mediaStore',
  label: 'Media Store',
  labelPlural: 'Media Stores',
  description: `A Media Store provides storage for images, audio or video, documents, or other files.`,
  typeField: true,
  typeInherits: true,
  typeRequired: true,
  typeRestricted: true,
  isConfigurable: true,
}

export const mediaMetaFields:AdminFieldgroupConfigSetting = {
  id: 'mediaMetaFields',
  admin: true,
  fields: {
    name: { type:'text', default:undefined, helptext:'the file name' },
    type: { type:'text', default:undefined, helptext:'the mime type' },
    size: { type:'number', default:undefined, helptext:'the file size' },
    date: { type:'date', default:undefined, helptext:'when the file was first uploaded / linked' },
    height: { type:'text', default:undefined, helptext:'the height of an image or video' },
    width: { type:'text', default:undefined, helptext:'the width of an image or video' },
    duration: { type:'text', default:undefined, helptext:'the duration of an audio or video file' },
  }
}

export class MediaStore implements ConfigurableEntity, TypedEntity {
  id:string
  type:string
  listMedia:(path?:string|null, options?:ConfigSetting)=>Promise<string[]>
  getMedia:(filename?:string|number|null, options?:ConfigSetting)=>Promise<string|string[]>
  saveMedia:(file:Blob, options?:ConfigSetting)=>Promise<string>
  deleteMedia:(filename:string, options?:ConfigSetting)=>Promise<any>
  immediateUpload:boolean
  options:ConfigSetting
  constructor(conf:string|MediaStoreConfigSetting, cms:SvelteCMS) {
    let store = typeof conf === 'string' ? cms.mediaStores[conf] : cms.mediaStores[conf?.id]
    if (!store) store = Object.values(cms.mediaStores)[0]
    this.id = store?.id
    this.listMedia = store?.listMedia ? store.listMedia.bind(this) : async () => { console.error(store?.id ? `No function 'listMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.getMedia = store?.getMedia ? store.getMedia.bind(this) : async () => { console.error(store?.id ? `No function 'getMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.saveMedia = store?.saveMedia ? store.saveMedia.bind(this) : async () => { console.error(store?.id ? `No function 'saveMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    this.deleteMedia = store?.deleteMedia ? store.deleteMedia.bind(this)  : async () => { console.error(store?.id ? `No function 'deleteMedia' for store '${this.id}'` : `Store ${this.id} not found`)}
    // this.getPreview = store?.getPreview ? store.getPreview.bind(this) : undefined
    // this.deletePreview = store?.deletePreview ? store.deletePreview.bind(this) : undefined
    this.options = cms.getInstanceOptions(store, conf)
    this.immediateUpload = Boolean(this.options.immediateUpload) || store.immediateUpload
  }
}

export default MediaStore