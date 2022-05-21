import type { ContentType } from "sveltecms/core/ContentType"
import type SvelteCMS from "sveltecms"
import { formDataHandler } from './formDataHandler'
import type { Content } from "sveltecms/core/ContentStore"

function getFormat(format:string):'json'|'form'|void {
  if (format === 'application/json') return 'json'
  else if (format.match(/^multipart\/form-data/)) return 'form'
}

async function parseRequest(cms:SvelteCMS, contentType:string|ContentType, request:Request):Promise<{format:string,data:any}> {
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

async function saveContentEndpoint(cms:SvelteCMS, contentType:string|ContentType, request:Request, options={}):Promise<Content> {
  let { format, data } = await parseRequest(cms, contentType, request)
  let content = await cms.saveContent(contentType, data, options)
  return content
}

async function deleteContentEndpoint(cms:SvelteCMS, contentType:string|ContentType, request:Request, options={}):Promise<Content> {
  let { format, data } = await parseRequest(cms, contentType, request)
  let content = await cms.deleteContent(contentType, data, options)
  return content
}

export {
  parseRequest,
  saveContentEndpoint,
  deleteContentEndpoint,
}