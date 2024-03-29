import type { CMSConfigSetting, CMSListConfig} from 'sveltecms'
import type { ComponentType } from './Component'
import type { EntityTemplate } from 'sveltecms/core/EntityTemplate'
import type { AdminPageConfig } from './AdminPage'
import type { ContentStoreType } from './ContentStore'
import type { ConfigFieldConfigSetting, FieldConfigSetting, FieldType } from './Field'
import type { FieldgroupConfigSetting } from './Fieldgroup'
import type { PluginHooks } from './Hook'
import type { IndexerType } from './Indexer'
import type { MediaStoreType } from './MediaStore'
import type { ScriptFunctionType } from './ScriptFunction'
import type Transformer from './Transformer'
import type { WidgetType } from './Widget'

export const templatePlugin:EntityTemplate = {
  id: 'plugin',
  label: 'Plugin',
  labelPlural: 'Plugins',
  description: 'Plugins add functionality and/or configuration to the SvelteCMS instance.',
  typeField: false,
  isConfigurable: true,
}

export type CMSPlugin = {
  id: string
  adminPages?: AdminPageConfig[]
  fieldTypes?: FieldType[]
  widgetTypes?: WidgetType[]
  transformers?: Transformer[]
  indexers?: IndexerType[]
  contentStores?: ContentStoreType[]
  mediaStores?: MediaStoreType[]
  adminFieldgroups?: FieldgroupConfigSetting[]
  components?: ComponentType[]
  lists?: CMSListConfig
  optionFields?:{[key:string]:ConfigFieldConfigSetting}
  fieldWidgets?:{[key:string]:string[]}
  hooks?:PluginHooks
  scriptFunctions?:ScriptFunctionType[],
  conf?:Omit<CMSConfigSetting, 'configPath'>,
}

export type CMSPluginBuilder = (config?:any) => CMSPlugin
