import * as components from './components'
import { adminPages } from 'sveltecms/core/AdminPage'

import type { AdminCollectionConfigSetting } from 'sveltecms/core/Collection'

export const collections:AdminCollectionConfigSetting[] = [
  {
    id: 'fieldConfig',
    admin: true,
    fields: {
      type: {
        type: 'text',
        default: '',
        widget: {
          type: 'select',
          options: {
            options: {
              function: '$cmsFieldTypes()'
            }
          }
        }
      },
    },
  },
]

export default {
  components: Object.entries(components).map(([id,component]) => ({ id, component, admin:true })),
  adminPages,
  collections,
}
