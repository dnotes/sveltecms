import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms'
import type SvelteCMS from 'sveltecms'
import { splitTags } from 'sveltecms/utils'
import type { Content } from './ContentStore'
import type ContentType from './ContentType'
import type { EntityTemplate } from './EntityTemplate'
import type { Media } from './MediaStore'

function noop(val?:any) { return async () => { return val } }

export type IndexerType = EntityType & ConfigurableEntityType & {
  saveContent:(contentType:ContentType, content:Content)=>Promise<void>
  deleteContent:(contentType:ContentType, content:Content)=>Promise<void>
  saveMedia:(media:Media)=>Promise<void>
  deleteMedia:(media:Media)=>Promise<void>
  searchContent:(contentType:ContentType, search:string|Object, options?:Object)=>Promise<Content & { _score?:number }[]>
  searchMedia:(search:string|Object, options?:Object)=>Promise<Media & { _score?:number }[]>
}

export const templateIndexer:EntityTemplate = {
  id: 'indexer',
  label: 'Indexer',
  labelPlural: 'Indexers',
  description: 'An Indexer maintains an index of content and media.',
  typeField: true,
  typeInherits: true,
  typeRequired: true,
  typeRestricted: true,
  isConfigurable: true,
  configFields: {
    mediaKeys: {
      type: 'text',
      default: 'type,size,height,width,duration,date',
      helptext: 'The media fields to index for media from a particular Media Store.'
    }
  }
}

export type IndexerConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {
  mediaKeys?: string|string[],
}

export class Indexer implements ConfigurableEntity, TypedEntity {
  id: string
  type: string
  saveContent:(contentType:ContentType, content:Content)=>Promise<void> = noop()
  deleteContent:(contentType:ContentType, content:Content)=>Promise<void> = noop()
  saveMedia:(media:Media)=>Promise<void> = noop()
  deleteMedia:(media:Media)=>Promise<void> = noop()
  searchContent:(contentType:ContentType, search:string|Object, options?:Object)=>Promise<Content[]> = noop([])
  searchMedia:(search:string|Object, options?:Object)=>Promise<Media[]> = noop([])
  mediaKeys:string[] = ['type', 'size', 'height', 'width', 'duration', 'date']
  options:ConfigSetting = {}
  constructor(conf:string|IndexerConfigSetting, cms:SvelteCMS) {
    if (typeof conf === 'string') conf = { type:conf }
    let indexer = cms.indexers[conf.type]
    if (!indexer) return this
    Object.keys(indexer).forEach(k => this[k] = indexer[k])
    this.saveContent = indexer.saveContent.bind(this)
    this.deleteContent = indexer.deleteContent.bind(this)
    this.saveMedia = indexer.saveMedia.bind(this)
    this.deleteMedia = indexer.deleteMedia.bind(this)
    this.searchContent = indexer.searchContent.bind(this)
    this.searchMedia = indexer.searchMedia.bind(this)
    if (conf.hasOwnProperty('mediaKeys')) this.mediaKeys = typeof conf.mediaKeys === 'string' ? splitTags()(conf.mediaKeys) : (conf.mediaKeys || [])
    this.options = cms.mergeConfigOptions(cms.getConfigOptionsFromFields(indexer.optionFields || {}), conf)
  }
}

export default Indexer