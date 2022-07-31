import cms from '$lib/cms'
import type { RequestEvent } from '@sveltejs/kit'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

export async function GET(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  let data
  if (adminPage?.GET) data = await adminPage.GET({cms, args, event})

  return { status: 200, body: { data } }
}

export async function POST(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.POST) return { status:405 }

  let data = await adminPage.POST({cms, args, event})
  return { status:200, body: { data } }
}

export async function DELETE(event:RequestEvent) {

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage || !adminPage.DELETE) return { status:405 }

  let data = await adminPage.DELETE({cms, args, event})
  return { status:200, body: { data } }
}
