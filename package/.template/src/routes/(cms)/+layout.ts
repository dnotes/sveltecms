import cms from '$lib/cms'
import { error, redirect } from '@sveltejs/kit'

export async function load(event) {

  const { url } = event
  let [ ,contentTypeID, slug ] = url?.pathname?.split('/')
  if (contentTypeID === 'admin') return {}

  let content, teasers
    if (slug) {
      // If we are not looking for the root content type
      if (contentTypeID !== cms?.conf?.settings?.rootContentType) {
        // Try to get the requested piece of content
        content = await cms.getContent(contentTypeID, slug)
      }
      if (!content) {
        return {} // 404 unless manually implemented by +page.svelte route
      }
    }
    else if (contentTypeID) {
      // If there is a root content type, try to get content from it
      if (cms?.conf?.settings?.rootContentType) {
        let rootContentType = cms?.conf?.settings?.rootContentType.toString()

        // Check if this is the front page
        if (contentTypeID === cms?.conf?.settings?.frontPageSlug?.toString()) {
          // console.log(`\n28 type:${contentTypeID} slug:${slug} front page\n`)
          throw redirect(301, '/')
        }

        // Check for root content with this slug
        let rootContent = await cms.listContent(rootContentType)
        if (rootContent && rootContent.length && rootContent.find(item => item._slug === contentTypeID)) content = await cms.getContent(rootContentType, contentTypeID)
        if (content) {
          teasers = await cms.listContent(contentTypeID) // e.g. create a "page" content named "blog", and it will list "blog" content under the page
          contentTypeID = cms.conf.settings.rootContentType.toString()
        }

      }
      if (!content && cms.contentTypes?.[contentTypeID]) content = await cms.listContent(contentTypeID)
      if (!content) {
        // console.log(`\n43 type:${contentTypeID} slug:${slug} no content list\n`)
        return {} // 404 unless manually implemented by +page.svelte route
      }
    }
    else if (cms?.conf?.settings?.rootContentType && cms?.conf?.settings?.frontPageSlug) {
      contentTypeID = cms.conf.settings.rootContentType.toString()
      content = await cms.getContent(contentTypeID, cms.conf.settings.frontPageSlug.toString()) || {}
    }
  // console.log(`\n56 type:${contentTypeID} slug:${slug} returning\n`)
  return {
    contentTypeID,
    content,
    teasers,
  }

}
