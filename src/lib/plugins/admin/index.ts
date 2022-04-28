import { CMSContentEdit, CMSContentList, CMSConfigEdit, CMSConfigList, CMSConfigFieldList, CMSConfig } from './components'

import type { CMSConfigFieldConfigSetting, CollectionConfigSetting } from 'sveltecms'

export type AdminPath = {
  id:string
  component:Object
  configPath?:string
  fieldCollection?:string
  title?:string
  fields?:{[id:string]:string|CMSConfigFieldConfigSetting}
}

export const adminPaths:AdminPath[] = [
  {
    id: 'config',
    component: CMSConfig,
  },
  {
    id: 'content',
    component: CMSContentList,
    fieldCollection: '',
  },
  {
    id: 'content/*',
    component: CMSContentList,
  },
  {
    id: 'content/*/*',
    component: CMSContentEdit,
  },
  {
    id: 'types',
    configPath: 'types',
    title: 'Content Types',
    component: CMSConfigList,
  },
  {
    id: 'types/*',
    configPath: 'types',
    title: 'Content Types',
    component: CMSConfigEdit,
  },
  {
    id: 'fields',
    configPath: 'fields',
    component: CMSConfigList,
    fieldCollection: 'fieldConfig',
  },
  {
    id: 'widgets',
    configPath: 'widgets',
    component: CMSConfigList,
  },
  {
    id: 'lists',
    configPath: 'lists',
    component: CMSConfigList,
  },
  {
    id: 'contentStores',
    configPath: 'contentStores',
    component: CMSConfigList,
  },
  {
    id: 'mediaStores',
    configPath: 'mediaStores',
    component: CMSConfigList,
  },
]

export const collections:CollectionConfigSetting[] = [
  {
    id: 'fieldConfig',
    admin: true,
    allowString: true,
    fields: {
      type: {
        type: 'text',
        default: '',
        widget: {
          type: 'select',
          options: {
            options: {
              function: '$cmsFieldTypes()'
            }
          }
        }
      },
    },
  },
]

export default {
  adminPaths,
  collections,
}
