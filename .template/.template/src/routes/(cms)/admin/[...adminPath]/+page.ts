export const prerender = false

import cms from '$lib/cms'
import type { RequestEvent } from '@sveltejs/kit'
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