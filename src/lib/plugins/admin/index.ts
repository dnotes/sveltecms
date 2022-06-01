import * as components from './components'
import { adminPages } from 'sveltecms/core/AdminPage'
import CMSWidgetConfigurableEntity from './widgets/CMSWidgetConfigurableEntity.svelte'
import type { CMSPlugin } from 'sveltecms'

export const adminPlugin:CMSPlugin = {
  id: 'admin',
  components: Object.entries(components).map(([id,component]) => ({ id, component, admin:true })),
  adminPages,
  fieldTypes: [{
    id: 'configurableEntity',
    admin: true,
    default: undefined,
    widget: 'configurableEntity',
    display: '',
  }],
  widgetTypes: [{
    id: 'configurableEntity',
    fieldTypes: [],
    admin: true,
    widget: CMSWidgetConfigurableEntity,
    optionFields: {
      entity: {
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
      }
    }
  }]
}

export default adminPlugin