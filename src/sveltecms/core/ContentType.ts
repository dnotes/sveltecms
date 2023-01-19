import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, DisplayableEntity, DisplayableEntityConfigSetting, FieldableEntity, LabeledEntity } from 'sveltecms';
import { SlugConfig, type SlugConfigSetting } from 'sveltecms/core/Slug'
import { ContentStore, type ContentStoreConfigSetting, type Value } from 'sveltecms/core/ContentStore'
import type { MediaStoreConfigSetting } from 'sveltecms/core/MediaStore'
import Field, { type FieldConfigSetting } from 'sveltecms/core/Field'
import type { EntityTemplate } from 'sveltecms/core/EntityTemplate'
import { getLabelFromID, splitTags } from 'sveltecms/utils';
import type { EntityDisplayConfigSetting } from './Display';

export const templateContentType:EntityTemplate = {
  id: 'contentType',
  label: 'Content Type',
  labelPlural: 'Content Types',
  description: `Content Types are the basic data structures of SvelteCMS. Each Content Type specifies how to enter, save, retrieve, display, and delete a document of its type.`,
  typeField: false,
  isFieldable: true,
  isConfigurable: true,
  isDisplayable: true,
  listFields: ['contentStore','mediaStore','slug'],
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
  }
}

export type ContentTypeConfigSetting = ConfigSetting & DisplayableEntityConfigSetting & {
  label?: string
  fields:{[id:string]: string|FieldConfigSetting}
  contentStore: string|ContentStoreConfigSetting
  mediaStore?: string|MediaStoreConfigSetting
  slug?: string|string[]|SlugConfigSetting
  form?:{
    method?:'post'|'get'
    action?:string
  }
}

export class ContentType implements FieldableEntity, LabeledEntity, DisplayableEntity {
  id:string
  label:string = ''
  isFieldable=true
  slug:SlugConfig
  contentStore:ContentStore
  mediaStore?:string|MediaStoreConfigSetting
  displays:EntityDisplayConfigSetting
  indexFields:string[]
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
    this.displays = cms.getFullEntityDisplayConfig('contentType',conf)
    this.indexFields = []
    this.form = {
      method:conf?.form?.method,
      action:conf?.form?.action,
    }
    Object.entries(conf.fields || {}).forEach(([id,conf]) => {
      this.fields[id] = new Field(id, conf, cms, this)
    })

    let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || ''
    this.slug = new SlugConfig(slugConf, cms)

    this.indexFields = cms.findFields(this.fields, f => f.index ? true : false)

  }
}

export default ContentType