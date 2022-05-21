import type { RequestEvent } from "@sveltejs/kit/types/private";
import cms from '$lib/cms'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

export async function get(event) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  let data
  if (adminPage?.get) data = await adminPage.get({cms, args, event})

  return { status: 200, body: { data } }
}

export async function post(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.post) return { status:405 }

  let data = await adminPage.post({cms, args, event})
  return { status:200, body: { data } }
}

export async function del(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.del) return { status:405 }

  let data = await adminPage.del({cms, args, event})
  return { status:200, body: { data } }
}
