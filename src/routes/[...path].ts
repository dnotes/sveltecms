import cms from '$lib/cms'

export async function get(event) {

  const { params } = event
  const [ contentTypeID, slug ] = params.path.split('/')

  let content
  try {
    if (slug) {
      content = await cms.getContent(contentTypeID, slug)
      if (!content) return { status:404 }
    }
    else if (contentTypeID) {
      content = await cms.listContent(contentTypeID)
      if (!content) return { status: 404 }
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
    body: { content }
  }

}
