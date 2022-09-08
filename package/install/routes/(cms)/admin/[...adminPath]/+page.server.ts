export const prerender = false

import cms from '$lib/cms'
import { error, type RequestEvent } from '@sveltejs/kit'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

export async function load(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  let data
  if (adminPage?.GET) data = await adminPage.GET({cms, args, event})

  return { data }
}

export async function POST(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.POST) throw error(405)

  let data = await adminPage.POST({cms, args, event})
  return { data }
}

export async function DELETE(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.DELETE) throw error(405)

  let data = await adminPage.DELETE({cms, args, event})
  return { data }
}
