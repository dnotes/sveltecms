
import type SvelteCMS from "sveltecms"
import type { LabeledEntity } from "sveltecms"
import type { RequestEvent } from "@sveltejs/kit/types/private"
import { Component, type ComponentConfigSetting } from "sveltecms/core/Component"
import { saveContentEndpoint, deleteContentEndpoint, parseRequest, getLabelFromID } from 'sveltecms/utils'

export type AdminPageConfig = {
  id:string
  component:string|ComponentConfigSetting
  label?:string
  get?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  post?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  del?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
}

export class AdminPage implements LabeledEntity {
  id:string
  component:Component
  label:string
  get?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  post?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  del?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Object})=>Promise<any>
  constructor(conf:AdminPageConfig, cms:SvelteCMS) {
    this.id = conf.id
    this.label = conf.label || getLabelFromID(this.id)
    this.component = new Component(conf.component, cms)
    this.get = conf.get
    this.post = conf.post
    this.del = conf.del
  }
}

export const adminPages:AdminPageConfig[] = [
  {
    id: 'config',
    component: 'CMSConfigView',
    post: async({cms,event,values})=>{
      if (event) return saveContentEndpoint(cms, cms.admin, event.request)
    }
  },
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
    label: 'Content Types',
    component: 'CMSContentTypeList',
  },
  {
    id: 'types/*',
    label: 'Content Types',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigContentType',
      },
    },
  },
  {
    id: 'fields',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigFieldList',
      },
    },
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
  // {
  //   id: 'lists',
  //   configPath: 'lists',
  //   component: CMSConfigList,
  //   options: {
  //     collection: 'listConfig',
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
]