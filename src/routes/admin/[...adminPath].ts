import type { RequestEvent } from "@sveltejs/kit/types/private";
import cms from '$lib/cms'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

import { saveContentEndpoint, deleteContentEndpoint, parseRequest } from "sveltecms/utils";
import { cmsConfigurables } from "sveltecms";

export async function post({request,params}:RequestEvent) {

  // Save full cms config object (using javascript fetch)
  if (params.adminPath === 'config') return saveContentEndpoint(cms, cms.admin, request)

  // Get path, id, and slug if available
  let [path, id, slug] = params.adminPath.split('/')

  // Handle content
  if (path === 'content') {
    if (!id || !slug || !cms.types[id]) return { status:400 }
    return saveContentEndpoint(cms, id, request)
  }

  // Get admin path
  let adminPath = cms.getAdminPath(params.adminPath)
  if (!adminPath) return { status:404 }

  path = adminPath.configPath
  if (cmsConfigurables.includes(path)) {
    throw new Error('Saving configuration requires Javascript.') // TODO: fix this.
  }

  return { status:200 }

}

export async function del({request,params}:RequestEvent) {
  let [path,type,slug] = params.adminPath.split('/')
  let adminPath = cms.getAdminPath(params.adminPath)
  if (!adminPath) return { status:404 }

}
