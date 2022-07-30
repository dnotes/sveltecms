import type SvelteCMS from "sveltecms"
import { get, isEqual, set } from "lodash-es"
import type { Content, Value } from "./ContentStore"
import type ContentType from "./ContentType"
import type Field from "./Field"

export type Change = {
  before?:Content,
  after?:Content,
  contentType?:ContentType
}

type Hook = {
  type: string
  label: string
  description: string
  fn: Function
  weight?: number
}

export type ContentPreWriteHook = Hook & {
  fn: (content:Content, cms:SvelteCMS, options:{[key:string]:any})=>Promise<void>
  type: 'contentPreSave'|'contentPreDelete'
}
export type ContentPostWriteHook = Hook & {
  fn: (change:Change, cms:SvelteCMS, options:{[key:string]:any})=>Promise<void>
  type: 'contentPostWrite'
}

export type PluginHooks = Array<ContentPreWriteHook|ContentPostWriteHook>

export type CMSHookFunctions = {
  contentPreSave: ContentPreWriteHook[]
  contentPreDelete: ContentPreWriteHook[]
  contentPostWrite: ContentPostWriteHook[]
}

// TODO: Make a special kind of Error for Hooks, including:
// - some way to collect multiple errors into one
// - some way to indicate a URL to check on each error

export const hooks:PluginHooks = [
  {
    type: 'contentPostWrite',
    label: 'References',
    description: 'Saves changes to any reference fields that are reverse linked.',
    fn: async (change, cms) => {

      // Get a list of all fields to be checked
      // The recursive function searches through the fields property for all
      // reference fields that have a widget with the "linkedField" option set
      // The array is the field's id (or path) in the content being saved,
      // and the id (or path) of the linked Field in the referenced content type
      let referenceFields:[string,string][] = []
      function getLinkedReferenceFields(fields:{[id:string]:Field}, prefix?:string) {
        Object.entries(fields).forEach(([id,field]) => {
          let fieldPath = [prefix,id].filter(Boolean).join('.')
          if (field.type === 'reference' && field.widget?.options?.linkedField && typeof field.widget.options.linkedField === 'string') {
            referenceFields.push([ fieldPath, field.widget.options.linkedField ])
          }
          if (field.isFieldable && field.fields) getLinkedReferenceFields(field.fields, fieldPath)
        })
      }
      getLinkedReferenceFields(change.contentType.fields)
      if (!referenceFields.length) return

      // Set array for errors
      let errors: Error[] = []

      // 1. Determine if the index object for this content has changed
      // 2. Make a list of all referenced items of content
      // 3. If the reference is not newly added,
      //    and the index object has NOT changed
      //    or if the linked Field uses slugOnly and the slug has not changed,
      //    filter out referenced content whose back reference hasn't changed
      // 4. Separate the list by Content Type
      // 5. Load content for each referenced item (can do this async)
      // 6. Update any linked Field value with the new item, or delete the old item
      // 7. Save the content for each ContentType, saving the index but skipping the hooks

      // 1.
      let oldIndexItem = cms.getIndexItem(change?.before)
      let newIndexItem = cms.getIndexItem(change?.after)
      let isChangedItem = !isEqual(oldIndexItem, newIndexItem)
      let oldSlug = change.before?._slug ? `${change?.before?._type}/${change?.before?._slug}` : undefined
      let newSlug = change.after?._slug ? `${change?.after?._type}/${change?.after?._slug}` : undefined
      let isChangedSlug = oldSlug === newSlug

      // 4. prepare an object keyed by content type ID, i.e. { contentTypeID: {} }
      let allContent:{[contentTypeID:string]:{[slug:string]:Content}} = {}
      cms.listEntities('contentType').forEach(k => { allContent[k] = {}})

      // iterating through each of the reference fields on the content being saved
      // this must be done synchronously because there may be multiple fields referencing
      // the same type of content and we must not load any piece of content multiple times
      for (let i=0; i<referenceFields.length; i++) {
        let [path, linkedFieldPath] = referenceFields[i]

        try {

          function getVars(item:Value) {
            return (typeof item === 'string') ? item.split('/') : [item?.['_type'], item?.['_slug']]
          }

          // Get field values for the field
          let oldValues = get(change.before || {}, path) ?? []
          let oldValueArray = Array.isArray(oldValues) ? oldValues : [oldValues].filter(Boolean)

          let newValues = get(change.after || {}, path) ?? []
          let newValueArray = Array.isArray(newValues) ? newValues : [newValues].filter(Boolean)

          // Change references that have been deleted
          let deleteRefs = oldValueArray
            .filter(item => newValueArray.findIndex(compare => {
              item === compare || (item?.['_type'] === compare?.['_type'] && item?.['_slug'] === compare?.['_slug'])
            }) === -1)
            .map(async item => {
              // Get content loading variables
              let [refType, refSlug] = getVars(item)
              let content = allContent[refType][refSlug] || await cms.getContent(refType, refSlug, { getRaw:true })
              if (!content) throw new Error(`Could not load content for ${refType}/${refSlug}`)
              let fieldValue = get(content, linkedFieldPath)
              if (!fieldValue) return // don't need to delete the reference
              if (!Array.isArray(fieldValue)) throw new Error(`Reference linkedField ${refType}/${refSlug}.${path} value is not an array of references.`)
              let idx = fieldValue.findIndex(v => (v === oldSlug || isEqual(v, oldIndexItem)))
              if (idx !== -1) {
                fieldValue.splice(idx,1)
                set(content, linkedFieldPath, fieldValue)
                allContent[refType][refSlug] = content
              }
          });

          // Change references that have been added or updated
          let updateRefs = newValueArray
          .map(async item => {
            // Get ContentType and Field, to check whether we need to update
            let [refType, refSlug] = getVars(item)
            let contentType = cms.getContentType(item['_type'])
            let linkedField = get(contentType.fields, linkedFieldPath)
            if (linkedField?.type !== 'reference') throw new Error(`Reference linkedField ${contentType?.id}.${linkedField?.id} must have type "reference" (${linkedField?.type})`)
            let slugOnly = linkedField.widget?.options?.slugOnly

            // 3. Check whether we can and need to update a reference
            if (oldValueArray.findIndex(compare => isEqual(item, compare)) !== -1) {
              if (slugOnly && !isChangedSlug) return
              if (!isChangedItem) return
            }

            // Get full content
            let content = allContent[refType][refSlug] || await cms.getContent(refType,refSlug, { getRaw: true })
            if (!content) throw new Error(`Could not load content for ${item['_type']}/${item['_slug']}`)

            let newReference = slugOnly ? newSlug : newIndexItem
            let fieldValue = get(content, linkedFieldPath)
            if (fieldValue && !Array.isArray(fieldValue)) throw new Error(`Reference linkedField ${item['_type']}/${item['_slug']}.${path} value is not an array of references.`)
            else if (!fieldValue) set(content, linkedFieldPath, [newReference])
            else if (Array.isArray(fieldValue)) { // It's always an array by now, but typescript complains
              let idx = fieldValue.findIndex(v => (v === oldSlug || (v['_type'] === oldIndexItem['_type'] && v['_slug'] === oldIndexItem['_slug'])))
              if (idx !== -1) {
                fieldValue.splice(idx, 1, newReference)
              }
              else {
                fieldValue.push(newReference)
              }
              set(content, linkedFieldPath, fieldValue)
            }
            allContent[refType][refSlug] = content
          })

          await Promise.all([ ...deleteRefs, ...updateRefs ])

          // 7. Save the content for each ContentType, saving the index but skipping the hooks
          let promises = Object.keys(allContent).map(async contentTypeID => {
            let content = Object.values(allContent[contentTypeID])
            if (content.length) await cms.saveContent(contentTypeID, content, { skipHooks:true })
          })

          await Promise.all(promises)

        }
        catch (e) {
          errors.push(e)
        }
      }

      if (errors.length) throw new Error(errors.map(e => `Reference linking: ${e.message}`).join('\r'))

    }
  }
]
