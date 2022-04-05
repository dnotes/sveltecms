import type { default as SvelteCMS, CMSPlugin, ConfigSetting, CMSConfigFieldConfigSetting, CMSContentField, CMSContentType } from '..'
import { get, set } from 'lodash-es'

export async function collapseFormItem(cms:SvelteCMS, contentType:CMSContentType, fields:{[id:string]:CMSContentField}, data:any, prefix?:string):Promise<any> {

  let promises = Object.entries(fields).map(async ([id,field]) => {

    let formPath = [prefix,id].filter(Boolean).join('.')
    let item = get(data, id)
    if (typeof item === 'undefined') return [id,undefined]

    let value

    let itemIsArray = Array.isArray(item)

    // Collection fields must be collapsed recursively
    if (field.type === 'collection') {
      if (field.multiple && itemIsArray) {
        let promises = Object.entries(item).map(async ([i,item]) => {
          return collapseFormItem(cms, contentType, field.fields, item, formPath)
        })
        value = await Promise.all(promises)
      }
      else if (itemIsArray) {
        value = await collapseFormItem(cms, contentType, field.fields, item['0'], formPath)
      }
      else { // This should not happen, but
        value = await collapseFormItem(cms, contentType, field.fields, item, formPath)
      }
    }

    // multiple fields must either handle multiple values or be an array - otherwise it's definitely an error
    else if (field.multiple && !itemIsArray && !(field.widget.handlesMultiple && field.widget.formDataHandler)) {
      throw new Error(`Multiple field "${id}" must either be an array or use a widget with handlesMultiple and formDataHandler.`)
    }

    // if it is a valid multiple field
    else if (field.multiple || field.widget.handlesMultiple) {

      // Use a formDataHandler if provided
      if (field.widget.formDataHandler) {
        if (field.widget.handlesMultiple) {
          value = await field.widget.formDataHandler(item, cms, contentType, field)
        }
        else {
          let promises = Object.entries(item).map(async ([i,item]) => {
            return field.widget.formDataHandler(item, cms, contentType, field)
          })
          value = await Promise.all(promises)
        }
      }
      else value = item.map(i => i[0])

      // For singular fields that use a widget with handlesMultiple, return the first value
      if (!field.multiple && Array.isArray(value)) value = value[0]

    }

    else if (field.widget.formDataHandler) {
      value = await field.widget.formDataHandler(item, cms, contentType, field)
    }

    else {
      value = itemIsArray ? item[0] : item
    }

    return [id, value]
  })

  const result = await Promise.all(promises)
  return Object.fromEntries(result)

}

/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export async function formDataHandler(cms:SvelteCMS, contentTypeID:string, formdata:FormData) {

  let rawdata = {}
  // @ts-ignore -- why does this not have a proper FormData object?!?!!
  for (let k of formdata.keys()) {
    set(rawdata, k, formdata.getAll(k))
  }

  const contentType = cms.getContentType(contentTypeID)

  return collapseFormItem(cms, contentType, contentType.fields, rawdata)

}

export default formDataHandler