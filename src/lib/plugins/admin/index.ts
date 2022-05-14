import * as components from './components'
import { adminPages } from 'sveltecms/core/AdminPage'

import type { AdminCollectionConfigSetting } from 'sveltecms/core/Collection'

export const collections:AdminCollectionConfigSetting[] = []

export default {
  components: Object.entries(components).map(([id,component]) => ({ id, component, admin:true })),
  adminPages,
  collections,
}
