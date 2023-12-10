export const prerender = false

import cms from "$lib/cms"
import { error, type ServerLoad } from "@sveltejs/kit"
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

export const POST:ServerLoad = async (event) => {

  if (import.meta.env.MODE !== 'development' && !cms?.conf?.settings?.buildAdmin) throw error(404, "Not found")

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage) throw error(404)

  if (!adminPage.POST) throw error(405)

  try {
    let data = await adminPage.POST({cms, args, event})
    return new Response(JSON.stringify(data))
  }
  catch(e) {
    throw e
  }

}

export const DELETE:ServerLoad = async (event) => {

  if (import.meta.env.MODE !== 'development' && !cms?.conf?.settings?.buildAdmin) throw error(404, "Not found")

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  if (!adminPage) throw error(404)
  if (!adminPage.DELETE) throw error(405)

  try {
    let data = await adminPage.DELETE({cms, args, event})
    return new Response(JSON.stringify(data))
  }
  catch(e) {
    throw e
  }

}
