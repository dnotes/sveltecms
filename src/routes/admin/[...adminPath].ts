import type { RequestEvent } from "@sveltejs/kit/types/private";
import cms from '$lib/cms'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

import { cmsConfigurables } from "sveltecms";

export async function get(event) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)
  if (!adminPage) return { status:200 }

  let data
  if (adminPage?.get) data = await adminPage.get({cms, args, event})

  return {
    status: 200,
    body: { data }
  }
}

export async function post(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)
  if (cmsConfigurables.includes(adminPage.configPath)) throw new Error('Saving configuration requires Javascript.') // TODO: fix this.
  if (!adminPage || !adminPage.post) return { status:405 }

  return adminPage.post({cms, args, event})
}

export async function del(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)
  if (!adminPage || !adminPage.del) return { status:405 }

  return adminPage.del({cms, args, event})
}
