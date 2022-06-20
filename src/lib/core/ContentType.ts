import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, FieldableEntity, LabeledEntity } from 'sveltecms';
import { SlugConfig, type SlugConfigSetting } from 'sveltecms/core/Slug'
import { ContentStore, type ContentStoreConfigSetting } from 'sveltecms/core/ContentStore'
import type { MediaStoreConfigSetting } from 'sveltecms/core/MediaStore'
import Field, { type FieldConfigSetting } from 'sveltecms/core/Field'
import type { EntityTemplate } from 'sveltecms/core/EntityTemplate'

import { getLabelFromID } from 'sveltecms/utils';
import type { ComponentConfigSetting } from './Component';

export const templateContentType:EntityTemplate = {
  id: 'contentType',
  label: 'Content Type',
  labelPlural: 'Content Types',
  typeField: false,
  isFieldable: true,
  isConfigurable: true,
  configFields: {
    label: {
      type: 'text',
      default: '',
      helptext: 'The label for the content type.',
    },
    contentStore: {
      type: 'entity',
      required: true,
      default: undefined,
      helptext: 'The content store which will hold the content.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'contentStore',
        }
      }
    },
    mediaStore: {
      type: 'entity',
      required: true,
      default: undefined,
      helptext: 'The content store which will hold the content.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'mediaStore',
        }
      }
    },
    slug: {
      type: 'entity',
      required: true,
      default: '',
      helptext: 'The fields used for the slug of the content type.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'slug',
        }
      }
    },
    previewComponent: {
      type: 'entity',
      default: undefined,
      helptext: '',
      widget: {
        type: 'entity',
        options: {
          entityType: 'component'
        }
      }
    },
    displayComponent: {
      type: 'entity',
      default: undefined,
      helptext: '',
      widget: {
        type: 'entity',
        options: {
          entityType: 'component'
        }
      }
    },
  }
}

export type ContentTypeConfigSetting = ConfigSetting & {
  label: string
  fields:{[id:string]: string|FieldConfigSetting}
  contentStore: string|ContentStoreConfigSetting
  mediaStore?: string|MediaStoreConfigSetting
  slug?: string|string[]|SlugConfigSetting
  previewComponent?:string|ComponentConfigSetting
  displayComponent?:string|ComponentConfigSetting
  form?:{
    method?:'post'|'get'
    action?:string
  }
}

export class ContentType implements FieldableEntity, LabeledEntity {
  id:string
  label:string = ''
  isFieldable=true
  slug:SlugConfig
  contentStore:ContentStore
  mediaStore?:string|MediaStoreConfigSetting
  previewComponent?:string|ComponentConfigSetting
  displayComponent?:string|ComponentConfigSetting
  fields:{[key:string]:Field} = {}
  form: {
    method?:'post'|'get'
    action?:string
  }
  constructor(id, conf:ContentTypeConfigSetting, cms:SvelteCMS) {
    this.id = id
    this.label = conf.label || getLabelFromID(this.id)
    this.contentStore = new ContentStore(conf?.contentStore, cms)
    this.mediaStore = conf.mediaStore
    this.previewComponent = conf.previewComponent
    this.displayComponent = conf.displayComponent
    this.form = {
      method:conf?.form?.method,
      action:conf?.form?.action,
    }
    Object.entries(conf.fields).forEach(([id,conf]) => {
      this.fields[id] = new Field(id, conf, cms, this)
    })

    let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || ''
    this.slug = new SlugConfig(slugConf, cms)

  }
}

export default ContentType