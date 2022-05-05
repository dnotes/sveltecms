import { CMSContentEdit, CMSContentList, CMSContentTypeList, CMSConfigEdit, CMSConfigList, CMSConfigFieldList, CMSConfigView } from './components'

import type { CMSConfigFieldConfigSetting, CollectionConfigSetting, ConfigSetting } from 'sveltecms'
import type { RequestEvent } from '@sveltejs/kit/types/private'
import type SvelteCMS from 'sveltecms'
import { saveContentEndpoint, deleteContentEndpoint, parseRequest } from 'sveltecms/utils'

export type AdminPage = {
  id:string
  component:Object
  configPath?:string
  title?:string
  fields?:{[id:string]:string|CMSConfigFieldConfigSetting}
  options?:ConfigSetting
  get?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  post?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  del?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
}

export const adminPages:AdminPage[] = [
  {
    id: 'config',
    component: CMSConfigView,
    post: async({cms,event,values})=>{
      if (event) return saveContentEndpoint(cms, cms.admin, event.request)

    }
  },
  {
    id: 'content',
    component: CMSContentTypeList,
  },
  {
    id: 'content/*',
    component: CMSContentList,
    get: async({cms, args})=>{
      return cms.listContent(args[1])
    }
  },
  {
    id: 'content/*/*',
    component: CMSContentEdit,
    get: async({cms, args})=>{
      if (args[2] === '_') return {}
      return cms.getContent(args[1], args[2], { getRaw:true })
    },
    post: async({cms, args, event, values})=>{
      if (event) return saveContentEndpoint(cms, args[1], event.request)
      else if (values) return cms.saveContent(args[1], values)
      return { status:400 }
    },
    del: async({cms, args, event, values})=>{
      if (event) return deleteContentEndpoint(cms, args[1], event.request)
      else if (values) return cms.deleteContent(args[1], values)
      return { status:400 }
    }
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
    options: {
      allowString: true,
      collection: 'fieldConfig',
      stringField: 'type',
    }
  },
  {
    id: 'widgets',
    configPath: 'widgets',
    component: CMSConfigList,
    options: {
      allowString: true,
      collection: 'widgetConfig',
      stringField: 'type',
    }
  },
  {
    id: 'lists',
    configPath: 'lists',
    component: CMSConfigList,
    options: {
      collection: 'listConfig',
      stringField: 'tags',
    }
  },
  {
    id: 'contentStores',
    configPath: 'contentStores',
    component: CMSConfigList,
    options: {
      collection: ''
    }
  },
  {
    id: 'mediaStores',
    configPath: 'mediaStores',
    component: CMSConfigList,
    options: {
      collection: ''
    }
  },
]

export const collections:CollectionConfigSetting[] = [
  {
    id: 'fieldConfig',
    admin: true,
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
  adminPages,
  collections,
}
