import { error, redirect, type RequestEvent } from "@sveltejs/kit"
import type SvelteCMS from "sveltecms"
import { Component, type ComponentConfigSetting } from "sveltecms/core/Component"
import { saveContentEndpoint, deleteContentEndpoint } from 'sveltecms/utils'
import type { Content } from "./ContentStore"
import type { EntityTemplate } from "./EntityTemplate"

export const templateAdminPage:EntityTemplate = {
  id: 'adminPage',
  label: 'Admin Page',
  labelPlural: 'Admin Pages',
  description: 'An Admin Page provides a configuration or information page for the Admin UI. Admin Pages are provided by plugins.',
  typeField: false,
}

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
      let contentType = cms.contentTypes[args[1]]
      if (!contentType) throw error(404, 'Not Found')
      let content = await cms.listContent(contentType)
      return content.map(item => {
        return {
          ...Object.fromEntries(contentType.slug.fields.map(id => ([id, item[id]]))),
          ...item,
        }
      })
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
      let content
      if (event) content = await saveContentEndpoint(cms, args[1], event.request)
      else if (values) content = await cms.saveContent(args[1], values)
      else throw new Error('Empty POST to content/*/*')
      if (args[2] !== content._slug) throw redirect(301, `/admin/${args[0]}/${args[1]}/${content._slug}`)
      return content
    },
    DELETE: async({cms, args, event, values})=>{
      let content = await cms.getContent(args[1],args[2])
      if (!content) throw error(404, 'Not found')
      try {
        await cms.deleteContent(args[1], content)
      }
      catch(e) {
        throw error(400, e.message)
      }
      throw redirect(303, `/admin/content/${args[1]}`)
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
    id: 'components',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigEntityList',
        configPath: 'fieldgroups',
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
        component: 'CMSConfigEntity'
      },
    },
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
    id: 'displays',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigDisplays'
      }
    }
  },
  // {
  //   id: 'plugins',
  //   component: {
  //     type: 'CMSConfigForm',
  //     options: {
  //       component: 'CMSConfigEntityList',
  //     }
  //   }
  // }, TODO: add config settings for Plugins
  {
    id: 'settings',
    component: {
      type: 'CMSConfigForm',
      options: {
        component: 'CMSConfigSettings',
      }
    },
    POST: async({cms,event,values})=>{
      if (event) {
        return saveContentEndpoint(cms, cms.admin, event.request, { filepath: cms.conf.configPath, skipIndex: true })
      }
    }
  },
]