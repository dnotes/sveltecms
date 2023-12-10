export const prerender = false
export const ssr = true
export const csr = true

import cms from '$lib/cms'
import { error, type RequestEvent } from '@sveltejs/kit'
import type { Actions } from './$types'
import admin from 'sveltecms/plugins/admin'
cms.use(admin)

export async function load(event:RequestEvent) {

  if (import.meta.env.MODE !== 'development' && !cms?.conf?.settings?.buildAdmin) throw error(404, "Not found")

  const { params } = event
  const args = params.adminPath.split('/')
  const adminPage = cms.getAdminPage(params.adminPath)

  try {
    let data
    if (adminPage?.GET) data = await adminPage.GET({cms, args, event})
    return { data }
  }
  catch(e) {
    throw e
  }
}

export const actions:Actions = {

  post: async (event) => {

    if (import.meta.env.MODE !== 'development' && !cms?.conf?.settings?.buildAdmin) throw error(404, "Not found")

    const { params } = event
    const args = params.adminPath.split('/')
    const adminPage = cms.getAdminPage(params.adminPath)

    if (!adminPage) throw error(404)
    if (!adminPage.POST) throw error(405)

    try {
      let data = await adminPage.POST({cms, args, event})
      return { data }
    }
    catch(e) {
      throw e
    }
  },

  delete: async (event) => {

    if (import.meta.env.MODE !== 'development' && !cms?.conf?.settings?.buildAdmin) throw error(404, "Not found")

    const { params } = event
    const args = params.adminPath.split('/')
    const adminPage = cms.getAdminPage(params.adminPath)

    if (!adminPage) throw error(404)
    if (!adminPage.DELETE) throw error(405)

    try {
      let data = await adminPage.DELETE({cms, args, event})
      return { data }
    }
    catch(e) {
      throw e
    }

  }

}