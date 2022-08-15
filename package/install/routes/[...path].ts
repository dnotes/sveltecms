import cms from '$lib/cms'

export async function GET(event) {

  const { params } = event
  let [ contentTypeID, slug ] = params.path.split('/')

  let content, teasers
  try {
    if (slug) {
      // If we are not looking for the root content type
      if (contentTypeID !== cms?.conf?.settings?.rootContentType) {
        // Try to get the requested piece of content
        content = await cms.getContent(contentTypeID, slug)
      }
      if (!content) {
        // console.log(`\n17 type:${contentTypeID} slug:${slug} not found\n`)
        return { status:404 }
      }
    }
    else if (contentTypeID) {
      // If there is a root content type, try to get content from it
      if (cms?.conf?.settings?.rootContentType) {
        let rootContentType = cms?.conf?.settings?.rootContentType.toString()

        // Check if this is the front page
        if (contentTypeID === cms?.conf?.settings?.frontPageSlug?.toString()) {
          // console.log(`\n28 type:${contentTypeID} slug:${slug} front page\n`)
          return { status:301, headers: { location: '/' } }
        }

        // Check for root content with this slug
        let rootContent = await cms.listContent(rootContentType)
        if (rootContent && rootContent.length && rootContent.find(item => item._slug === contentTypeID)) content = await cms.getContent(rootContentType, contentTypeID)
        if (content) {
          teasers = await cms.listContent(contentTypeID)
          contentTypeID = cms.conf.settings.rootContentType.toString()
        }

      }
      if (!content) content = await cms.listContent(contentTypeID)
      if (!content) {
        // console.log(`\n43 type:${contentTypeID} slug:${slug} no content list\n`)
        return { status: 404 }
      }
    }
    else if (cms?.conf?.settings?.rootContentType && cms?.conf?.settings?.frontPageSlug) {
      contentTypeID = cms.conf.settings.rootContentType.toString()
      content = await cms.getContent(contentTypeID, cms.conf.settings.frontPageSlug.toString())
    }
  }
  catch(e) {
    // console.log(`\n53 type:${contentTypeID} slug:${slug} error\n`)
    return e
  }
  // console.log(`\n56 type:${contentTypeID} slug:${slug} returning\n`)
  return {
    status: 200,
    body: {
      contentTypeID,
      content,
      teasers,
    }
  }

}
