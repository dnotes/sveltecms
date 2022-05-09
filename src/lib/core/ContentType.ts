import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, FieldableEntity, LabeledEntity } from 'sveltecms';
import { SlugConfig, type SlugConfigSetting } from 'sveltecms/core/Slug'
import { ContentStore, type ContentStoreConfigSetting } from 'sveltecms/core/ContentStore'
import type { MediaStoreConfigSetting } from 'sveltecms/core/MediaStore'
import Field, { type FieldConfigSetting } from 'sveltecms/core/Field'

import { getLabelFromID } from 'sveltecms/utils';


export type ContentTypeConfigSetting = ConfigSetting & {
  label: string
  fields:{[id:string]: string|FieldConfigSetting}
  contentStore: string|ContentStoreConfigSetting
  mediaStore?: string|MediaStoreConfigSetting
  slug?: string|string[]|SlugConfigSetting
}

export class ContentType implements FieldableEntity, LabeledEntity {
  id:string
  label:string = ''
  slug:SlugConfig
  contentStore:ContentStore
  mediaStore?:string|MediaStoreConfigSetting
  fields:{[key:string]:Field} = {}
  form?: {
    method?:'post'|'get'
    action?:string
    previewComponent?:string
  }
  constructor(id, conf:ContentTypeConfigSetting, cms:SvelteCMS) {
    this.id = id
    this.label = conf.label || getLabelFromID(this.id)

    this.contentStore = new ContentStore(conf?.contentStore, cms)
    this.mediaStore = conf.mediaStore

    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new Field(id, conf, cms, this)
    })

    let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || ''
    this.slug = new SlugConfig(slugConf, cms)

  }
}

export default ContentType