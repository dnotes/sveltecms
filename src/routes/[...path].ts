import cms from '$lib/cms'

export async function GET(event) {

  const { params } = event
  let [ contentTypeID, slug ] = params.path.split('/')

  let content
  try {
    if (slug) {
      // If we are not looking for the root content type
      if (contentTypeID !== cms?.conf?.settings?.rootContentType) {
        // Try to get the requested piece of content
        content = await cms.getContent(contentTypeID, slug)
      }
      if (!content) return { status:404 }
    }
    else if (contentTypeID) {
      // If there is a root content type, try to get content from it
      if (cms?.conf?.settings?.rootContentType) {
        if (contentTypeID === cms?.conf?.settings?.frontPageSlug?.toString()) return { status:301, headers: { location: '/' } }
        content = await cms.getContent(cms?.conf?.settings?.rootContentType.toString(), contentTypeID)
        if (content) contentTypeID = cms.conf.settings.rootContentType.toString()
      }
      if (!content) content = await cms.listContent(contentTypeID)
      if (!content) return { status: 404 }
    }
    else if (cms?.conf?.settings?.rootContentType && cms?.conf?.settings?.frontPageSlug) {
      contentTypeID = cms.conf.settings.rootContentType.toString()
      content = await cms.getContent(contentTypeID, cms.conf.settings.frontPageSlug.toString())
    }
  }
  catch(e) {
    return {
      status: 500,
      body: JSON.stringify(e)
    }
  }
  return {
    status: 200,
    body: {
      contentTypeID,
      content,
    }
  }

}
