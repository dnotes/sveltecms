import type SvelteCMS from 'sveltecms'
import type ContentType from 'sveltecms/core/ContentType'
import Field from 'sveltecms/core/Field'
import { get, set } from 'lodash-es'
import Fieldgroup from 'sveltecms/core/Fieldgroup'

function handleMedia(cms, field, item) {
  if (!field?.fields?.src) field.fields = Object.assign((field.fields || {}), { src: new Field('src', 'text', cms) })
  let _meta = Object.fromEntries(Object.keys(item?._meta || {}).map(k => {
    if (k === 'date') return [k, new Date(item._meta[k][0])]
    if (['size','height','width'].includes(k)) return [k, parseInt(item._meta[k][0])]
    if (k === 'duration') return [k, parseFloat(item._meta[k][0])]
    return [k, item._meta[k][0]]
  }))
  return { ...item, _meta }
}

export async function collapseFormItem(cms:SvelteCMS, contentType:ContentType, fields:{[id:string]:Field}, data:any, prefix?:string):Promise<any> {

  let _media = []

  // Get all fields, as promises (some formDataHandler functions are async)
  let promises = Object.entries(fields || {}).map(async ([id,field]) => {

    // This function is recursive, and the prefix is provided for nested levels of a data object
    let formPath = [prefix,id].filter(Boolean).join('.')
    let item = get(data, id)
    if (typeof item === 'undefined') return [id,undefined]

    let value

    let itemIsArray = Array.isArray(item)

    if (field.handlesMedia) {

      // Collect all data, and format for data storage
      let fieldValues = []
      Object.keys(item).filter(k => k.match(/^\d+$/)).sort().forEach(k => {
        fieldValues.push(handleMedia(cms, field, item[k]))
      })

      // Prepare all data and save uploaded files
      if (item.files.length) {
        const promises = fieldValues.filter(v => v?._meta?.name).map(async v => {
          let file = item.files.find(f => f.name === v._meta.name)
          if (file) {
            v.src = await field.mediaStore.saveMedia(file, field.mediaStore.options)
          }
        })
        const result = await Promise.all(promises)
      }

      item = { ...fieldValues }

    }

    // Fieldgroup fields must be collapsed recursively
    if (field.type === 'fieldgroup' || field.widget.handlesFields || field.handlesMedia) {
      if (field.multiple && itemIsArray) {
        let promises = Object.entries(item).map(async ([i,item]) => {
          let fields = item?.['_fieldgroup']?.[0] ? new Fieldgroup(item?.['_fieldgroup']?.[0], cms).fields : field.fields
          let value = await collapseFormItem(cms, contentType, fields, item, formPath)
          if (value?.['_media']) {
            _media.push(...value['_media'])
            value['_media'] = undefined
          }
          return value
        })
        value = await Promise.all(promises)
      }
      else if (itemIsArray) {
        value = await collapseFormItem(cms, contentType, field.fields, item['0'], formPath)
      }
      else if (item?._fieldgroup?.[0]) {
        let fieldgroup = new Fieldgroup(item?._fieldgroup[0], cms)
        if (fieldgroup) {
          value = await collapseFormItem(cms, contentType, fieldgroup.fields, item, formPath)
        }
      }
      else { // This happens with fields of type fieldgroup whose fields are set manually
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

    // If it is a singular field with a formDataHandler
    else if (field.widget.formDataHandler) {
      value = await field.widget.formDataHandler(item, cms, contentType, field)
    }

    // If it is a singular field without a formDataHandler
    else {
      value = itemIsArray ? item[0] : item
    }

    if (field.handlesMedia) {
      if (Array.isArray(value)) value.forEach(v => {
        _media.push({ usage:formPath, value:v})
      })
      else _media.push({ usage:formPath, value })
    }

    return [id, value]
  })

  const result = await Promise.all(promises)

  // Now any special data not provided by a Field
  if (data?._slug?.[0]) result.push(['_slug', data._slug[0]])
  if (data?._oldSlug?.[0]) result.push(['_oldSlug', data._oldSlug[0]])
  if (data?._fieldgroup?.[0]) result.push(['_fieldgroup', data._fieldgroup[0]])
  if (data?._meta) result.push(['_meta', data._meta])
  if (_media.length) result.push(['_media', _media])

  console.log(_media)

  return Object.fromEntries(result)

}

/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export async function formDataHandler(cms:SvelteCMS, contentType:string|ContentType, formdata:FormData) {

  let rawdata = {}
  // @ts-ignore -- why does this not have a proper FormData object? doesn't FormData have .keys()?
  for (let k of formdata.keys()) {
    set(rawdata, k, formdata.getAll(k))
  }

  contentType = typeof contentType === 'string' ? cms.getContentType(contentType) : contentType

  return collapseFormItem(cms, contentType, contentType.fields, rawdata)

}

export default formDataHandler