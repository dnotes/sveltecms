import type { RequestEvent } from "@sveltejs/kit"
import type SvelteCMS from "sveltecms"
import { Component, type ComponentConfigSetting } from "sveltecms/core/Component"
import { saveContentEndpoint, deleteContentEndpoint } from 'sveltecms/utils'
import type { Content } from "./ContentStore"

export type AdminPageConfig = {
  id:string
  component:string|ComponentConfigSetting
  label?:string|(string|undefined|false)[]
  GET?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  POST?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Content})=>Promise<any>
  DELETE?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Content})=>Promise<any>
}

export class AdminPage {
  id:string
  component:Component
  label:(string|undefined|false)[]
  GET?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent})=>Promise<any>
  POST?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Content})=>Promise<any>
  DELETE?: (data:{cms:SvelteCMS, args:string[], event?:RequestEvent, values?:Content})=>Promise<any>
  constructor(conf:AdminPageConfig, cms:SvelteCMS) {
    this.id = conf.id
    if (conf.label) this.label = typeof conf.label === 'string' ? [conf.label] : conf.label
    else this.label = []
    this.component = new Component(conf.component, cms)
    this.GET = conf.GET
    this.POST = conf.POST
    this.DELETE = conf.DELETE
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
    GET: async({cms, args})=>{
      return cms.listContent(args[1])
    }
  },
  {
    id: 'content/*/*',
    component: 'CMSContentEdit',
    label: ['Content',,'Edit'],
    GET: async({cms, args})=>{
      if (args[2] === '_') return {}
      return cms.getContent(args[1], args[2], { getRaw:true })
    },
    POST: async({cms, args, event, values})=>{
      if (event) return saveContentEndpoint(cms, args[1], event.request)
      else if (values) return cms.saveContent(args[1], values)
      throw new Error('Empty POST to content/*/*')
    },
    DELETE: async({cms, args, event, values})=>{
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
  // {
  //   id: 'lists',
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
    id: 'settings',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigSettings',
      }
    },
    POST: async({cms,event,values})=>{
      if (event) return saveContentEndpoint(cms, cms.admin, event.request, { filepath: cms.conf.configPath, skipIndex: true })
    }
  },
]