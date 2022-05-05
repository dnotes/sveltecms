import type { CMSContentType } from "sveltecms"
import type SvelteCMS from "sveltecms"
import { formDataHandler } from './formDataHandler'

function getFormat(format:string):'json'|'form'|void {
  if (format === 'application/json') return 'json'
  else if (format.match(/^multipart\/form-data/)) return 'form'
}

async function parseRequest(cms:SvelteCMS, contentType:string|CMSContentType, request:Request):Promise<{format:string,data:any}> {
  let data
  let format = getFormat(request.headers.get('Content-Type'))
  if (format === 'json') {
    data = await request.json()
    return { format, data }
  }
  else if (format === 'form') {
    let formdata = await request.formData()
    data = await formDataHandler(cms, contentType, formdata)
    return { format, data }
  }
  throw new Error(`Content-Type must be application/json or multipart/form-data (got ${format})`)
}

async function saveContentEndpoint(cms:SvelteCMS, contentType:string|CMSContentType, request:Request, options={}) {
  let content
  try {
    let { format, data } = await parseRequest(cms, contentType, request)
    content = data
    let response = await cms.saveContent(contentType, content, options)
    if (format === 'json') {
      response.headers['Content-Type'] = 'application/json'
      return response
    }
  }
  catch(error) {
    return {
      status: 500,
      body: {
        message: error.message,
        request,
        content,
        stack: error.stack.split('\n'),
      }
    }
  }
}

async function deleteContentEndpoint(cms:SvelteCMS, contentType:string|CMSContentType, request:Request, options={}) {
  let content
  try {
    let { format, data } = await parseRequest(cms, contentType, request)
    let response = await cms.deleteContent(contentType, content, options)
    if (format === 'json') {
      response.headers['Content-Type'] = 'application/json'
      return response
    }
  }
  catch(error) {
    return {
      status: 500,
      body: {
        message: error.message,
        request,
        content,
        stack: error.stack.split('\n'),
      }
    }
  }
}

export {
  parseRequest,
  saveContentEndpoint,
  deleteContentEndpoint,
}