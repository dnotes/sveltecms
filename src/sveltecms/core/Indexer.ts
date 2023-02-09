import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms'
import type SvelteCMS from 'sveltecms'
import { splitTags } from 'sveltecms/utils'
import type { Content } from './ContentStore'
import type ContentType from './ContentType'
import type { EntityTemplate } from './EntityTemplate'
import type { Changeset } from './Hook'
import type { Media } from './MediaStore'

export type IndexItem = Content
export type IndexChange = { before?:IndexItem, after?:IndexItem }

export function isIndexItem(item:IndexItem|any): item is IndexItem {
  return (<IndexItem>item)?._type !== undefined
}


function noop(val?:any) { return async () => { return val } }

export type IndexerType = EntityType & ConfigurableEntityType & {
  getIndex:(id:string)=>Promise<IndexItem[]>
  updateIndex:(id:string, changes:IndexChange[])=>Promise<void>
  saveIndex:(id:string, index:IndexItem[])=>Promise<void>
  searchIndex:(id:string, search?:string, options?:Object) => Promise<(Content|Media) & { _score?:number }[]>
  saveContent:(contentType:string|ContentType, content:IndexItem|IndexItem[])=>Promise<void>
  deleteContent:(contentType:string|ContentType, content:IndexItem|IndexItem[])=>Promise<void>
  indexMedia:(changeset:Changeset, cms:SvelteCMS, options:{[key:string]:any})=>Promise<void>
  saveMedia:(media:Media|Media[])=>Promise<void>
  deleteMedia:(media:Media|Media[])=>Promise<void>
  searchContent:(contentType:string|ContentType, search:string|Object, options?:Object)=>Promise<Content & { _score?:number }[]>
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
  getIndex:(id:string)=>Promise<IndexItem[]> = noop()
  updateIndex:(id:string, changes:IndexChange[])=>Promise<void>
  saveIndex:(id:string,index:IndexItem|IndexItem[])=>Promise<void> = noop()
  searchIndex:(id:string, search?:string, options?:Object) => Promise<(Content|Media) & { _score?:number }[]> = noop()
  saveContent:(contentType:ContentType, content:Content|Content[])=>Promise<void> = noop()
  deleteContent:(contentType:ContentType, content:Content|Content[])=>Promise<void> = noop()
  indexMedia:(changeset:Changeset, cms:SvelteCMS, options:{[key:string]:any})=>Promise<void> = noop()
  saveMedia:(media:Media|Media[])=>Promise<void> = noop()
  deleteMedia:(media:Media|Media[])=>Promise<void> = noop()
  searchContent:(contentType:ContentType, search:string|Object, options?:Object)=>Promise<Content[]> = noop([])
  searchMedia:(search:string|Object, options?:Object)=>Promise<Media[]> = noop([])
  mediaKeys:string[] = ['type', 'size', 'height', 'width', 'duration', 'date']
  options:ConfigSetting = {}
  constructor(id:string, conf:string|IndexerConfigSetting, cms:SvelteCMS) {
    this.id = id
    if (typeof conf === 'string') conf = { type:conf }
    this.type = conf.type
    let indexer = cms.indexers[conf.type]
    if (!indexer) return this
    this.getIndex = indexer.getIndex.bind(this)
    this.updateIndex = indexer.updateIndex.bind(this)
    this.saveIndex = indexer.saveIndex.bind(this)
    this.searchIndex = indexer.searchIndex.bind(this)
    this.saveContent = indexer.saveContent.bind(this)
    this.deleteContent = indexer.deleteContent.bind(this)
    this.indexMedia = indexer.indexMedia.bind(this)
    this.saveMedia = indexer.saveMedia.bind(this)
    this.deleteMedia = indexer.deleteMedia.bind(this)
    this.searchContent = indexer.searchContent.bind(this)
    this.searchMedia = indexer.searchMedia.bind(this)
    if (conf.hasOwnProperty('mediaKeys')) this.mediaKeys = typeof conf.mediaKeys === 'string' ? splitTags()(conf.mediaKeys) : (conf.mediaKeys || [])
    this.options = cms.mergeConfigOptions(cms.getConfigOptionsFromFields(indexer.optionFields || {}), conf)
  }
}

export default Indexer