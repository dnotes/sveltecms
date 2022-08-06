import type { CMSPlugin } from 'sveltecms'
import * as components from './components'
import { adminPages } from 'sveltecms/core/AdminPage'
import CMSWidgetEntity from './widgets/CMSWidgetEntity.svelte'
import CMSWidgetEntityList from './widgets/CMSWidgetEntityList.svelte'

export const adminPlugin:CMSPlugin = {
  id: 'admin',
  components: Object.entries(components).map(([id,component]) => ({ id, component, admin:true })),
  adminPages,
  fieldTypes: [
    {
      id: 'entity',
      admin: true,
      default: undefined,
      widget: 'entity',
      display: '',
    },
    {
      id: 'entityList',
      admin: true,
      default: undefined,
      widget: 'entityList',
      display: '',
    }
  ],
  widgetTypes: [
    {
      id: 'entity',
      fieldTypes: ['entity'],
      admin: true,
      description: `Form element for the configuration for a single entity.`,
      handlesMultiple: true,
      widget: CMSWidgetEntity,
      optionFields: {
        entityType: {
          type: 'text',
          required: true,
          default: '',
          helptext: 'The type of entity to be configured.',
          widget: {
            type: 'select',
            options: {
              items: '$listEntities()'
            }
          }
        },
        fieldType: {
          type: 'text',
          default: '',
          helptext: 'The field type for which a widget will be chosen. Only used when Entity Type is "widget".',
        },
      }
    },
    {
      id: 'entityList',
      fieldTypes: ['entityList'],
      admin: true,
      description: `Form element for the configuration of a list of entities.`,
      widget: CMSWidgetEntityList,
      optionFields: {
        entityType: {
          type: 'text',
          required: true,
          default: 'field',
          helptext: 'The type of entity to be configured.',
          widget: {
            type: 'select',
            options: {
              items: '$listEntities()'
            }
          }
        },
      }
    }
  ]
}

export default adminPlugin