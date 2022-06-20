
import type SvelteCMS from "sveltecms"
import type { RequestEvent } from "@sveltejs/kit/types/private"
import { Component, type ComponentConfigSetting } from "sveltecms/core/Component"
import { saveContentEndpoint, deleteContentEndpoint } from 'sveltecms/utils'
import fs from 'fs'

export type AdminPageConfig = {
  id:string
  component:string|ComponentConfigSetting
  label?:string|(string|undefined|false)[]
  get?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  post?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  del?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
}

export class AdminPage {
  id:string
  component:Component
  label:(string|undefined|false)[]
  get?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  post?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  del?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  constructor(conf:AdminPageConfig, cms:SvelteCMS) {
    this.id = conf.id
    if (conf.label) this.label = typeof conf.label === 'string' ? [conf.label] : conf.label
    else this.label = []
    this.component = new Component(conf.component, cms)
    this.get = conf.get
    this.post = conf.post
    this.del = conf.del
  }
}

export const adminPages:AdminPageConfig[] = [
  {
    id: 'content',
    component: 'CMSContentTypeList',
  },
  {
    id: 'content/*',
    component: 'CMSContentList',
    get: async({cms, args})=>{
      return cms.listContent(args[1])
    }
  },
  {
    id: 'content/*/*',
    component: 'CMSContentEdit',
    label: ['Content',,'Edit'],
    get: async({cms, args})=>{
      if (args[2] === '_') return {}
      return cms.getContent(args[1], args[2], { getRaw:true })
    },
    post: async({cms, args, event, values})=>{
      if (event) return saveContentEndpoint(cms, args[1], event.request)
      else if (values) return cms.saveContent(args[1], values)
      throw new Error('Empty POST to content/*/*')
    },
    del: async({cms, args, event, values})=>{
      if (event) return deleteContentEndpoint(cms, args[1], event.request)
      else if (values) return cms.deleteContent(args[1], values)
      throw new Error('Empty DELETE to content/*/*')
    }
  },
  {
    id: 'widgets',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      },
    },
  },
  {
    id: 'fields',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      },
    },
  },
  {
    id: 'fieldgroups',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      }
    }
  },
  {
    id: 'contentTypes',
    label: 'Content Types',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      }
    }
  },
  {
    id: 'contentTypes/*',
    label: 'Content Types',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigContentType',
      },
    },
  },
  // {
  //   id: 'lists',
  //   configPath: 'lists',
  //   component: CMSConfigList,
  //   options: {
  //     fieldgroup: 'listConfig',
  //     stringField: 'tags',
  //   }
  // },
  {
    id: 'contentStores',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      },
    },
  },
  {
    id: 'mediaStores',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
      },
    },
  },
  {
    id: 'config',
    component: 'CMSConfigView',
    post: async({cms,event,values})=>{
      if (event) return saveContentEndpoint(cms, cms.admin, event.request)
    }
  },
]