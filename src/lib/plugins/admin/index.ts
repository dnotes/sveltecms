import { CMSContentEdit, CMSContentList, CMSConfigEdit, CMSConfigList, CMSConfigFieldList } from './components'

import type { CMSConfigFieldConfigSetting } from 'sveltecms'

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
    id: 'widgets/*',
    configPath: 'widgets',
    component: CMSConfigEdit,
  },
  {
    id: 'lists',
    configPath: 'lists',
    component: CMSConfigList,
  },
  {
    id: 'lists/*',
    configPath: 'lists',
    component: CMSConfigEdit,
  },
  {
    id: 'contentStores',
    configPath: 'contentStores',
    component: CMSConfigList,
  },
  {
    id: 'contentStores/*',
    configPath: 'contentStores',
    component: CMSConfigEdit,
  },
  {
    id: 'mediaStores',
    configPath: 'mediaStores',
    component: CMSConfigList,
  },
  {
    id: 'mediaStores/*',
    configPath: 'mediaStores',
    component: CMSConfigEdit,
  },
]

export type AdminFieldCollectionSetting = {
  id:string
  fields:{[id:string]:CMSConfigFieldConfigSetting}
  allowString?:true
}

export const adminFieldCollections:AdminFieldCollectionSetting[] = [
  {
    id: 'fieldConfig',
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
  adminFieldCollections,
}
