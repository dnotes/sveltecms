import SvelteCMS from 'sveltecms'
import defaultContent from 'sveltecms/plugins/defaultContent'
import markdown from 'sveltecms/plugins/markdown'
import math from 'sveltecms/plugins/math'
import checkboxes from 'sveltecms/plugins/checkboxes'
import md from '$lib/md'

const cms = new SvelteCMS({}, [
  markdown({ md }),
  defaultContent,
  math,
  checkboxes,
])

export const items = Object.keys(cms.entityTypes)
  .sort()
  .map(id => {
    let entityType = cms.getEntityType(id)
    // @ts-ignore
    let item = {
      label: entityType.label,
      labelPlural: entityType.labelPlural,
      isConfigurable: entityType.isConfigurable,
      description: entityType.description,
      configFields: Object.entries(entityType?.configFields || {}).map(([id,field])=> {
        return {
          ...field,
          property: id,
          default: JSON.stringify(field.default),
          script: (field.scriptable) ? 'yes' : '',
          description: field.helptext
        }
      }),
      detailHeading: '',
      detail: [],
      itemsHeadings: [],
    }

    // Preparing detailed information
    if (id === 'field') {
      item.detailHeading = 'Field Types'
      item.itemsHeadings = ["type", "widgets"]
      item.detail = cms.listEntities('fieldTypes').map(id => {
        return {
          heading: '',
          items: [{
            type: id,
            widgets: cms.getFieldTypeWidgets(false, id).join(', ')
          }]
        }
      })
    }
    else if (id === 'contentType') {
      item.detailHeading = 'Content Types'
      item.itemsHeadings = ['id', 'fields']
      item.detail = cms.listEntities('contentTypes').map(id => {
        return {
          heading: '',
          items: [{
            id,
            fields: Object.keys(cms.contentTypes[id].fields).join(', ')
          }]
        }
      })
    }
    else if (['adminPage','component','hook','display'].includes(id)) {}
    else if (cms.listEntities((id === 'widget' ? 'widgetTypes' : id))?.length) {
      let entityTypeID = id === 'widget' ? 'widgetType' : id
      item.detailHeading = id === 'widget' ? 'Widget Types' : entityType.labelPlural
      item.itemsHeadings = ["option", "type", "default", "script", "description"]
      item.detail = cms.listEntities((id === 'widget' ? 'widgetTypes' : id))
      .map(id => cms.getEntity(entityTypeID, id))
      .filter(entity => entity && (!entity?._parent || entity?.id === entity?._parent?.id))
      .map(entity => {
        return {
          heading: entity.id,
          description: entity?.description ?? '',
          items: Object.entries(cms.getEntityConfigFields(id, entity.id)).map(([propID,field]) => {
            return {
              option: propID,
              type: field.type,
              default: JSON.stringify(field.default),
              script: field.scriptable ? 'yes' : '',
              description: field.helptext,
            }
          })
        }
      })
    }
    return item
  });

export default items