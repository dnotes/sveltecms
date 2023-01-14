import { AdminPage, templateAdminPage, type AdminPageConfig } from './core/AdminPage'
import { Field, templateField, fieldTypes, type FieldType, type FieldConfigSetting, type ConfigFieldConfigSetting } from './core/Field'
import { widgetTypes, templateWidget, type WidgetType, type WidgetConfigSetting } from './core/Widget'
import { ContentType, templateContentType, type ContentTypeConfigSetting } from "./core/ContentType"
import { type MediaStoreType, type MediaStoreConfigSetting, templateMediaStore } from './core/MediaStore'
import { templateContentStore, type Content, type ContentStoreConfigSetting, type ContentStoreType, type Value } from './core/ContentStore'
import { type FieldgroupConfigSetting, type AdminFieldgroupConfigSetting, Fieldgroup, templateFieldgroup } from './core/Fieldgroup'
import { transformers, templateTransformer, type Transformer, type TransformerConfigSetting } from './core/Transformer'
import { ScriptFunction, scriptFunctions, type ScriptFunctionType, type ScriptFunctionConfig, parseScript, templateScriptFunction } from './core/ScriptFunction'
import { type ComponentType, type ComponentConfigSetting, type Component, templateComponent } from 'sveltecms/core/Component'
import { displayComponents, templateDisplay, type EntityDisplayConfigSetting, type EntityDisplayConfig, defaultDisplayModes, isDisplayConfig, type DisplayConfigSetting, type FullEntityDisplayConfig } from 'sveltecms/core/Display'
import staticFilesPlugin from 'sveltecms/plugins/staticFiles'
import { cloneDeep, mergeWith, get as getProp, union, sortBy, isEqual, merge, uniq } from 'lodash-es'
import type { EntityTemplate } from './core/EntityTemplate'
import SlugConfig, { templateSlug } from './core/Slug'
import { Indexer, templateIndexer, type IndexerConfigSetting, type IndexerType, type IndexItem } from './core/Indexer'
import { hooks, templateHook, type CMSHookFunctions, type PluginHooks } from './core/Hook'
import { templatePlugin, type CMSPlugin, type CMSPluginBuilder } from './core/Plugin'
export { CMSPlugin, CMSPluginBuilder }

const customComponents = import.meta.glob('/src/cms/*.svelte')

// import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export const FieldPropsAllowFunctions = [
  'label', 'helptext', 'required', 'disabled',
  'hidden', 'class', 'default', // TODO: 'value',
  'multiple', 'multipleLabelFields', 'multipleMin', 'multipleMax',
]

export const cmsConfigurables = [
  'settings',
  'adminStore',
  'contentTypes',
  // 'lists',
  'indexers',
  'contentStores',
  'mediaStores',
  'fields',
  'widgets',
  'fieldgroups',
  'transformers'
]

export type TypedEntity = {
  id:string
  type:string
}

export type TypedEntityConfigSetting = {
  id?:string // Deprecated. Remove for 1.0.
  type:string
}

export type ConfigurableEntity = {
  options?:ConfigSetting
}

export type ConfigurableEntityConfigSetting = TypedEntityConfigSetting & {
  options?:ConfigSetting
}

export type ConfigurableEntityConfigSettingValue<T> = string|T|(string|T)[]

export type LabeledEntity = {
  label:string|ScriptFunctionConfig
}

export type FieldableEntityType = {
  isFieldable?:boolean
  fields?:{[id:string]:FieldConfigSetting}
}

export type FieldableEntity = {
  isFieldable:boolean
  fields?:{[id:string]:Field}
}

export type FieldableEntityConfigSetting = {
  fields:{[id:string]:string|FieldConfigSetting}
}

export type DisplayableEntity = {
  displays:EntityDisplayConfigSetting
  displayComponent?:Component
}

export type DisplayableEntityType = EntityType & {
  displays:EntityDisplayConfigSetting
  displayComponent?:string
}

export type DisplayableEntityConfigSetting = {
  displays?:EntityDisplayConfigSetting
}

export type EntityType = {
  id:string
}

export type ConfigurableEntityType = EntityType & {
  optionFields?:{[key:string]:ConfigFieldConfigSetting}
  options?:ConfigSetting
}

type CMSSettings = ConfigSetting & {
  adminStore?:string|ContentStoreConfigSetting
  indexer?:string|IndexerConfigSetting
  rootContentType?:string
  frontPageSlug?:string
  defaultContentDisplays?:EntityDisplayConfigSetting
}

export type CMSConfigSetting = {
  configPath?:string
  settings?:CMSSettings
  adminStore?:string|ContentStoreConfigSetting
  contentTypes?: {[key:string]: ContentTypeConfigSetting}
  lists?: {[key:string]: string|(string|number|{id:string|number, value:ConfigSetting})[]}
  contentStores?: {[key:string]: ContentStoreConfigSetting}
  mediaStores?: {[key:string]: MediaStoreConfigSetting}
  fields?: {[key:string]: FieldConfigSetting}
  widgets?: {[key:string]: WidgetConfigSetting}
  fieldgroups?: {[key:string]: FieldgroupConfigSetting}
  transformers?: {[key:string]: TransformerConfigSetting}
  components?: {[key:string]: ComponentConfigSetting}
  plugins?: {[key:string]: ConfigSetting}
}

export default class SvelteCMS {
  conf:CMSConfigSetting = {}
  entityTypes = {
    // If an Entity Type name ever ends in "s", change getEntity and listEntities.
    // TODO: make this not be a thing.
    adminPage: templateAdminPage,
    component: templateComponent,
    contentStore: templateContentStore,
    contentType: templateContentType,
    display: templateDisplay,
    field: templateField,
    fieldgroup: templateFieldgroup,
    hook: templateHook,
    indexer: templateIndexer,
    mediaStore: templateMediaStore,
    plugin: templatePlugin,
    scriptFunction: templateScriptFunction,
    slug: templateSlug,
    transformer: templateTransformer,
    widget: templateWidget,
  }
  admin: ContentType
  indexer: Indexer
  adminPages?: {[key:string]:AdminPageConfig} = {}
  adminFieldgroups?: {[key:string]:AdminFieldgroupConfigSetting} = {}
  fields:{[key:string]:FieldConfigSetting} = {}
  fieldgroups: {[key:string]:FieldgroupConfigSetting} = {}
  components: {[key:string]:ComponentType} = {}
  widgets:{[key:string]:WidgetConfigSetting} = {}
  scriptFunctions:{[key:string]:ScriptFunctionType} = scriptFunctions
  fieldTypes:{[key:string]:FieldType & { widgetTypes?:string[] }} = fieldTypes
  widgetTypes:{[key:string]:WidgetType} = widgetTypes
  transformers:{[key:string]:Transformer} = transformers
  contentStores:{[key:string]:ContentStoreType} = {}
  mediaStores:{[key:string]:MediaStoreType} = {}
  indexers:{[key:string]:IndexerType} = {}
  contentTypes:{[key:string]:ContentType} = {}
  defaultContentType: ContentType
  defaultContentDisplays: FullEntityDisplayConfig
  lists:CMSListConfig = {}
  plugins:{[key:string]:CMSPlugin} = {}
  hooks:CMSHookFunctions = {
    contentPreSave: [],
    contentPreDelete: [],
    contentPostWrite: [],
  }
  constructor(conf:CMSConfigSetting, plugins:CMSPlugin[] = []) {

    this.conf = merge({
      configPath: 'src/lib/sveltecms.config.yml',
      settings: {
        rootContentType: 'page',
        frontPageSlug: 'front',
        defaultContentDisplays: {
          default: 'div',
          reference: 'span',
        }
      }
    }, conf)
    this.defaultContentDisplays = {
      default: 'div',
      page: 'div',
      teaser: 'div',
      reference: 'span',
      ...this.parseEntityDisplayConfigSetting((this?.conf?.settings?.defaultContentDisplays || {}))
    }

    this.use(staticFilesPlugin)
    displayComponents.forEach(c => {
      this.components[c.id] = c
    })
    plugins.forEach(p => this.use(p))

    Object.keys(customComponents).forEach(filepath => {
      let id = filepath.replace('/src/cms/', '').replace(/\.svelte$/i, '')
      this.components[id] = {
        id,
        component: customComponents[filepath]().then(c => c?.default),
      }
    })

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists || []).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    });

    // Initialize all of the stores, widgets, and transformers specified in config
    ['contentStores', 'mediaStores', 'transformers', 'components', 'fieldgroups', 'indexers'].forEach(objectType => {

      if (conf?.[objectType]) {
        Object.entries(conf[objectType]).forEach(([id,settings]) => {

          // config can:
          // - create a new item (`conf.widgetTypes.newItem = ...`)
          // - modify an existing item (`conf.widgetTypes.text = ...`)
          // - create a new item based on an existing item (`conf.widgetTypes.longtext = { type:"text", ... })
          const type = conf[objectType][id].type || conf[objectType][id].id || id

          // we merge all of the following
          this[objectType][id] = this.mergeConfigOptions(
            // the base item of this type
            cloneDeep(this[objectType][type] || {}),
            // the config item
            // @ts-ignore
            settings,
            // the config item, as a set of options (for shorthand)
            {
              id, // TODO: is this necessary?
              _parent:this[objectType][type], // We need to know the parent object so that we can change default options on e.g. the staticFiles Content Store
              options: settings
            },
          )

        })
      }
    });

    ['fields', 'widgets'].forEach(objectType => {
      if (conf?.[objectType]) {
        let typesKey = objectType.replace('s','Types')
        Object.entries(conf[objectType]).forEach(([id,item]) => {
          item = typeof item === 'string' ? { type: item } : item
          let type:string = item['type']
          if (!type || typeof type !== 'string') throw new Error(`Type is required for ${objectType}.${id} (received ${JSON.stringify(type)})`)
          let _parent = this[objectType][type] ?? this[typesKey][type]
          if (!_parent) throw new Error(`Parent not found for ${objectType}.${id}. Is "${id}" a typo? Did you define ${objectType}.${id} before ${objectType}.${item?.['type'] ?? item}?`)
          // @ts-ignore This has been type checked by now
          this[objectType][id] = { ...item, _parent }
        })
      }
    })

    // Build out config for the content types
    Object.entries(conf?.contentTypes || {}).forEach(([id,conf]) => {
      this.contentTypes[id] = new ContentType(id, conf, this)
    });

    // @ts-ignore
    this.defaultContentType = new ContentType('default', {
      id: 'default',
      contentStore: '',
      displays: this.conf.settings.defaultContentDisplays || 'div',
      fields: Object.fromEntries(this.listEntities('field').map(id => {
        return [id, this.fields[id] || id]
      }))
    }, this)

    let adminStore = conf.adminStore || conf.configPath || 'src/lib/sveltecms.config.json'
    if (typeof adminStore === 'string' && !this.contentStores[adminStore]) {
      let contentDirectory = adminStore.replace(/\/[^\/]+$/, '')
      let fileExtension = adminStore.replace(/.+[\.]/, '')
      if (!['json','yml','yaml'].includes(fileExtension)) throw new Error('adminStore must end in .json, .yml, or .yaml.')
      adminStore = {
        type: 'staticFiles',
        options: {
          contentDirectory,
          fileExtension,
        }
      }
    }
    this.admin = new ContentType('admin', {
      label: 'Admin',
      contentStore: adminStore,
      slug: {
        fields: ['configPath'],
        slugify: 'getFilename'
      },
      fields: {
        configPath:'text',
        ...Object.fromEntries(cmsConfigurables.map(k => [k, 'fieldgroup']))
      }
    }, this)

    hooks.forEach(hook => {
      // @ts-ignore These will be correct.
      this.hooks[hook.type].push(hook)
    })
    Object.keys(this.hooks).forEach(k => {
      this.hooks[k] = sortBy(this.hooks[k], ['weight', 'label'])
    })

    this.indexer = new Indexer('default', conf?.settings?.indexer ?? 'staticFiles', this)

  }

  use(plugin:CMSPlugin, config?:any) {
    // TODO: allow CMSPluginBuilder function, in case people pass the function instead of the plugin
    this.plugins[plugin.id] = plugin;

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists','adminPages','components','fieldgroups','indexers','scriptFunctions'].forEach(k => {
      try {
        plugin?.[k]?.forEach(conf => {
          if (conf) this[k][conf.id] = conf
        })
      }
      catch(e) {
        e.message = `Plugin ${plugin.id} failed loading ${k}\n${e.message}`
        throw e
      }
    });

    ['fields', 'widgets'].forEach(objectType => {
      if (plugin?.[objectType]) {
        let typesKey = objectType.replace('s','Types')
        plugin[objectType].forEach(item => {
          if (!item?.id) return
          let type:string = item['type']
          if (!type || typeof type !== 'string') throw new Error(`Type is required for ${item.id} (received ${JSON.stringify(type)})`)
          let _parent = this[objectType][type] ?? this[typesKey][type]
          if (!_parent) throw new Error(`Parent not found for ${item.id}. Is "${item.id}" a typo? Did you define ${item.id} before ${objectType}.${item?.['type']}?`)
          // @ts-ignore This has been type checked by now
          this[objectType][item.id] = { ...item, _parent }
        })
      }
    })

    if (plugin.contentTypes) {
      plugin.contentTypes.forEach((contentType) => {
        if (contentType && contentType?.id) this.contentTypes[contentType.id] = new ContentType(contentType.id, contentType, this)
      })
    }

    // @ts-ignore How would we do this? If there is a bad implementation, that is the fault of the plugin...
    if (plugin.hooks) plugin.hooks.forEach(hook => { this.hooks?.[hook.type]?.push(hook) })

    // This allows plugins to update existing widgets to work with provided fields. See markdown plugin.
    Object.entries(plugin?.fieldWidgets || {}).forEach(([fieldTypeID, widgetTypeIDs]) => {
      widgetTypeIDs.forEach(id =>{ if (!this.widgetTypes[id].fieldTypes.includes(fieldTypeID)) this.widgetTypes[id].fieldTypes.push(fieldTypeID) })
    })

  }

  preMount(fieldableEntity:ContentType|Field|Fieldgroup, values:Content):Content {
    let res = {} // variable for result
    Object.entries(fieldableEntity?.fields || {}).forEach(([id,field]) => {
    if (values.hasOwnProperty(id)) {
      try {
        // For references, fieldgroups, or other fieldable field types (e.g. possibly image)
        if ((field.type === 'reference' || field.type === 'fieldgroup' || field?.fields) && values?.[id] && typeof values?.[id] !== 'string') {
          if (Array.isArray(values[id])) {
            res[id] = []
            for (let i=0;i<values[id]['length'];i++) {
              // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
              let container = field.type === 'reference'
                ? (this.contentTypes[values[id][i]?.['_type']] || this.defaultContentType)
                : (values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field)
              res[id][i] = this.preMount(container, values[id][i])
            }
          }
          else {
            let container = field.type === 'reference'
              ? (this.contentTypes[values[id]?.['_type']] || this.defaultContentType)
              : values[id]?.['_fieldgroup'] ? new Fieldgroup(values[id]?.['_fieldgroup'], this) : field
            // @ts-ignore the typecheck above should be sufficient
            res[id] = container?.fields ? this.preMount(container, values?.[id]) : values[id]
          }
        }
        else res[id] = this.doFieldTransforms('preMount', field, this.doFieldTransforms('preSave', field, values?.[id]))
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    }
    })
    // Pass on CMS-specific items like _slug (beginning with _)
    Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k])
    return res
  }

  preSave(fieldableEntity:ContentType|Field|Fieldgroup, values:Content):Content {
    let res = {}
    Object.entries(fieldableEntity?.fields || {}).forEach(([id,field]) => {
    if (values.hasOwnProperty(id)) {
      try {
        // For references and fieldgroups (as above)
        if ((field.type === 'reference' || field.type === 'fieldgroup' || field?.fields) && values?.[id] && typeof values?.[id] !== 'string') {
          res[id] = []
          if (Array.isArray(values[id])) {
            for (let i=0;i<values[id]['length'];i++) {
              // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
              let container = field.type === 'reference'
                ? (this.contentTypes[values[id][i]?.['_type']] || this.defaultContentType)
                : values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field
              res[id][i] = this.preSave(container, values[id][i])
            }
          }
          else {
            let container = field.type === 'reference'
              ? (this.contentTypes[values[id]?.['_type']] || this.defaultContentType)
              : values[id]['_fieldgroup'] ? new Fieldgroup(values[id]['_fieldgroup'], this) : field
            // Any "fieldgroup" fields in content can be static (with "fields" prop) or dynamic, chosen by content editor
            // We get the new Fieldgroup for the latter case, and either way the container will have "fields" prop.
            // When saving config, the "fieldgroup" fields will not have a "fields" prop, and must still be saved.
            // @TODO: Evaluate this for security, and probably fix it, since at the moment it will try to save
            // almost any value to the configuration, albeit serialized.
            // @ts-ignore the typecheck above should be sufficient
            res[id] = container?.fields ? this.preSave(container, values?.[id]) : values[id]
          }
        }
        else res[id] = this.doFieldTransforms('preSave', field, values?.[id])
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreSave/${field.id} : ${e.message}`
        throw e
      }
    }
    })
    Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k])
    return res
  }

  doFieldTransforms(op:'preSave'|'preMount', field:Field, value:any) {
    try {
      if (field[op] && field[op].length && value !== undefined && value !== null) {
        field[op].forEach((functionConfig:TransformerConfigSetting) => {
          if (Array.isArray(value)) value = value.map(v => this.transform(v, functionConfig))
          else value = this.transform(value, functionConfig)
        })
      }
      return value
    }
    catch(e) {
      e.message = `value: ${JSON.stringify(value, null, 2)}\n${field.id}/${op} : ${e.message}`
      throw e
    }
  }

  listEntities(type:string, includeAdmin?:boolean, entityID?:string):string[] {
    let typeSingular = type.replace(/s$/,'')
    let typePlural = `${typeSingular}s`
    if (typePlural === 'fields') {
        if (entityID) return Object.keys(this.getContentType(entityID)?.fields || {})
        return this.getFieldTypes(includeAdmin)
    }
    else if (typePlural === 'widgets') {
        return this.getFieldTypeWidgets(includeAdmin, entityID)
    }
    else if ([ 'widgetType', 'fieldType', ...Object.keys(this.entityTypes)].includes(typeSingular)) {
        return Object.keys(this[typePlural] ?? {}).filter(k => (includeAdmin || !this[typePlural][k]?.['admin']))
    }
        return Object.keys(this.entityTypes)
  }

  getEntityType(type:string):EntityTemplate {
    if (this?.entityTypes?.[type]) return cloneDeep(this?.entityTypes?.[type])
    if (this?.entityTypes?.[type?.replace(/s$/,'')]) return cloneDeep(this?.entityTypes?.[type?.replace(/s$/,'')])
  }

  getEntity(type:string, id:string) {
    if (!type || !id) return
    if (!type.match(/s$/)) type += 's'
    if (type === 'fields') return this.fields[id] ?? this.fieldTypes[id]
    if (type === 'widgets') return this.widgets[id] ?? this.widgetTypes[id]
    return this?.[type]?.[id]
  }

  getEntityParent(type:string, id:string) {
    if (!type || !id) return
    if (type === 'fields' || type === 'field') return this.fields[id] ?? this.fieldTypes[id]
    if (type === 'widgets' || type === 'widget') return this.widgets[id] ?? this.widgetTypes[id]
    return this?.[type]?.[id]
  }

  getEntityRoot(type:string, id:string) {
    if (!type || !id) return
    if (type === 'fields') return this.fieldTypes[id] || this.getEntityRoot('fields', this.fields?.[id]?.['type'])
    if (type === 'widgets') return this.widgetTypes[id] || this.getEntityRoot('widgets', this.widgets?.[id]?.['type'])
    let entityType = this?.[type]?.[id]
    if (!entityType?.type || entityType?.type === entityType?.id) return entityType
    return this.getEntityRoot(type, entityType?.type)
  }

  getFieldTypes(includeAdmin?:boolean) {
    return union(
      Object.keys(this.fieldTypes || {}).filter(k => includeAdmin || !this.fieldTypes[k].admin),
      Object.keys(this.fields || {}).filter(k => includeAdmin || !this.fields[k].admin),
    )
  }

  getFieldTypeWidgets(includeAdmin?:boolean, fieldTypeID?:string) {
    let widgetTypes = Object.keys(this.widgetTypes || {}).filter(k => includeAdmin || !this.widgetTypes[k].admin)
    let widgets = Object.keys(this.widgets || {})
    let fieldTypeRoot = this.getEntityRoot('fields', fieldTypeID)
    if (!fieldTypeID || !fieldTypeRoot) return union(widgetTypes, widgets)
    return union(
      widgetTypes.filter(k => this.widgetTypes[k].fieldTypes.includes(fieldTypeRoot.id)),
      widgets.filter(k => this.widgetTypes[this.widgets[k].type].fieldTypes.includes(fieldTypeRoot.id)),
    )
  }

  getContentType(contentType:string):ContentType {
    if (!this.contentTypes[contentType]) throw new Error (`Content type not found: ${contentType}`)
    return this.contentTypes[contentType]
  }

  getContentStore(contentType:string|ContentType) {
    const type = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    return type.contentStore
  }

  getUrl(item:Content, contentTypeID?:string) {
    if (!contentTypeID) contentTypeID = item._type
    if (contentTypeID === this?.conf?.settings?.rootContentType) contentTypeID = ''
    let slug = item._slug
    if (!contentTypeID && slug === this?.conf?.settings?.frontPageSlug) slug = ''
    return '/' + [contentTypeID, slug].filter(Boolean).join('/')
  }

  slugifyContent(content:Content|Content[], contentType:ContentType, force?:boolean) {
    if (Array.isArray(content)) {
      content.forEach(c => {
        c._slug = this.getSlug(c, contentType.slug, force)
        c._type = contentType.id
      })
    }
    else {
      content._slug = this.getSlug(content, contentType.slug, force)
      content._type = contentType.id
    }
    return content
  }

  getSlug(content:any, slug:SlugConfig, force:boolean) {
    if (content._slug && !force) return content._slug
    return slug.fields
      .map(id => getProp(content,id))
      .filter(value => typeof value !== 'undefined')
      .map(value => this.transform(value, slug.slugify))
      .join(slug.separator)
  }

  async listContent(contentTypes:string|ContentType|Array<string|ContentType>, options:string|{
    skipIndex?:boolean, // If you need to rebuild the index directly from the database.
    getRaw?:boolean, // If you want the raw content, i.e. for <form> values.
    searchText?:string|undefined, // Filter indexed items by search text. Will not work with skipIndex.
    [key:string]:any
  } = {}):Promise<Content[]> {

    // Ensure proper types for options and contentTypes
    let opts = typeof options === 'string' ? { searchText:options } : options
    if (!Array.isArray(contentTypes)) contentTypes = [contentTypes]
    contentTypes = contentTypes.map(t => typeof t === 'string' ? this.contentTypes[t] ?? t : t)

    // Get raw content
    let contentLists = await Promise.all(contentTypes.map(async contentType => {
      let rawContent
      // Usually we will get items from the Indexer, unless a full content search is desired
      // AND we are sure we are dealing with a real content type (we may not be, with reference fields)
      if (!opts?.['skipIndex'] || typeof contentType === 'string') {
        // @ts-ignore these are typechecked above
        rawContent = await this.indexer.searchContent(contentType, opts.searchText, opts)
      }
      else {
        const db = this.getContentStore(contentType)
        rawContent = await db.listContent(contentType, {...db.options, ...opts})
      }
      if (!rawContent || !rawContent.length) return []

      // For referene fields, we may not be dealing with a full content type.
      // At the moment we just return the IndexItem.
      // TODO: Evaluate for security and usability:
      // - Are there cases where passing a free-tagged IndexItem to Display will be insecure?
      // - Can/Should we add a phantom Content Type to Indexer or CMS, so that we can preMount?
      if (typeof contentType === 'string') return rawContent

      this.slugifyContent(rawContent, contentType)
      if (opts['getRaw']) return rawContent
      return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : [this.preMount(contentType, rawContent)]
    }))

    // Unify content arrays
    return [].concat(...contentLists)

  }

  /**
   * Gets an individual piece of content or all content of a content type
   * @param contentType string
   * The id of the content type
   * @param slug string
   * The text slug for an individual piece of content
   * @param options object
   * @returns object
   */
  async getContent(contentType:string|ContentType, slug:string|number|null, options:{[key:string]:any} = {}):Promise<Content> {
    // For content references, we may need to get an item that is not actually a content type.
    if (typeof contentType === 'string' && !this.contentTypes[contentType]) {
      let index = await this.indexer.getIndex(contentType)
      return index.find(item => item._slug === slug) || undefined
    }

    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)

    let rawContent = await db.getContent(contentType, {...db.options, ...options}, slug)

    // For content references, it may happen that some items are stored only in the index file
    if (!rawContent || (Array.isArray(rawContent) && !rawContent.length)) {
      rawContent = (await this.indexer.getIndex(contentType.id)).find(item => item?._slug === slug)
    }

    // If there's really no content, just return.
    if (!rawContent || isEqual(rawContent, [])) return

    if (Array.isArray(rawContent)) rawContent = rawContent.find(item => item?._slug === slug) || rawContent[0]
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    return this.preMount(contentType, rawContent)
  }

  async saveContent(
    contentType:string|ContentType,
    content:Content|Content[],
    options:{ skipHooks?:boolean, skipIndex?:boolean, [key:string]:any } = {}
  ):Promise<Content|Content[]> {

    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    let items = Array.isArray(content) ? content : [content]

    for (let i=0; i<items.length; i++) {

      // Set up old Content for contentPostWrite hooks
      let before
      if (contentType === this.admin) before = cloneDeep(this.conf)
      else if (items[i]._oldSlug && !options.skipHooks) {
        before = await db.getContent(contentType, {...db.options, options}, items[i]._oldSlug)
        before = this.slugifyContent(this.preSave(contentType, before), contentType)
      }

      // Get the new Content for the contentPreWrite hooks
      // @ts-ignore this should already be type safe
      items[i] = this.slugifyContent(this.preSave(contentType, items[i]), contentType)

      // When a slug is changing, don't allow the change if it would overwrite content
      if ( items[i]._oldSlug &&
        items[i]._slug !== items[i]._oldSlug &&
        (await this.listContent(contentType)).find(item => item._slug === items[i]._slug)
      ) throw new Error(`Tried to overwrite content: ${contentType.id}/${items[i]._slug}`)

      // Run contentPreWrite hooks, and bail if there is an error
      try {
        if (!options.skipHooks) await this.runHook('contentPreSave', items[i], contentType, this, {...db.options, ...options})
      }
      catch(e) {
        e.message = `Error saving content ${items[i]._type}/${items[i]._slug}:\n${e.message}`
        throw e
      }

      items[i] = await db.saveContent(items[i], contentType, {...db.options, ...options})

      // When a slug is changing, delete the old content
      if (items[i]._oldSlug && items[i]._slug !== items[i]._oldSlug) await this.deleteContent(contentType, before, { newSlug:items[i]._slug })

      try {
        if (!options.skipHooks) await this.runHook('contentPostWrite', { before, after: items[i], contentType }, this, {...db.options, ...options})
      }
      catch(e) {
        console.log(e.message.split('\r'))
        items[i]._errors = e.message.split('\r')
      }

    }

    if (!options.skipIndex) await this.indexer.saveContent(contentType, items.map(i => this.getIndexItem(i)))

    return Array.isArray(content) ? items : items[0]

  }

  async deleteContent(
    contentType:string|ContentType,
    content:Content|Content[],
    options:{skipHooks?:boolean, skipIndex?:boolean, [key:string]:any} = {}
  ):Promise<Content|Content[]> {

    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    let items = Array.isArray(content) ? content : [content]

    for (let i=0; i<items.length; i++) {

      // Get the content to be deleted, for preDelete hooks
      // @ts-ignore slugifyContent returns singular if passed singular
      items[i] = this.slugifyContent(this.preSave(contentType, items[i]), contentType)

      // Run contentPreWrite hooks, and bail if there is an error
      try {
        if (!options.skipHooks) await this.runHook('contentPreDelete', items[i], contentType, this, {...db.options, ...options})
      }
      catch(e) {
        e.message = `Error deleting content ${items[i]._type}/${items[i]._slug}:\n${e.message}`
        throw e
      }

      items[i] = await db.deleteContent(items[i], contentType, {...db.options, ...options})

      try {
        if (!options.skipHooks) await this.runHook('contentPostWrite', { before: items[i], contentType }, this, {...db.options, ...options})
      }
      catch(e) {
        console.log(e.message.split('\r'))
        items[i]._errors = e.message.split('\r')
      }

    }

    if (!options.skipIndex) await this.indexer.deleteContent(contentType, items.map(i => this.getIndexItem(i)))

    return Array.isArray(content) ? items : items[0]
  }

  newContent(contentTypeID:string, values:{[id:string]:Value} = {}):Content {
    if (!this.contentTypes[contentTypeID]) return
    // Here we start the process of obtaining a new piece of content.
    // To do this, we have to initialize the fields as Widgets, because
    // they may have Script Functions determining their default values.
    let contentType = this.getWidgetFields(this.contentTypes[contentTypeID], { values, errors:{}, touched:{} })
    function getDefaults(entity:WidgetFieldFieldgroup, prefix='') {
      return Object.fromEntries(Object.entries(entity.fields)
        .map(([id,field]) => {
          let fieldPath = [prefix, id].filter(Boolean).join('.')
          if (!field.isFieldable) return [id, getProp(field.values, fieldPath) ?? field.default]
          let fieldgroup = this.getWidgetFields(field)
          return getDefaults(fieldgroup, fieldPath)
        }));
    }
    let content = getDefaults(contentType)
    // @ts-ignore slugifyContent returns a single object if passed a single object
    return this.slugifyContent(content, this.contentTypes[contentTypeID])
  }

  getIndexItem(content?:Content):IndexItem|undefined {
    if (!content) return
    let contentType = this.contentTypes[content?._type] || this.defaultContentType
    // For IndexItem, only use _slug and _type fields (TODO: evaluate)
    let item = { _slug:content._slug, _type:content._type }
    // Also index all fields in the list of indexFields
    contentType.indexFields.forEach(k => { item[k] = getProp(content, k) })
    return item
  }

  async runHook(type:string, ...args) {
    let hooks = this.hooks[type] ?? []
    for (let i=0; i<hooks.length; i++) {
      await hooks[i].fn(...args)
    }
  }

  transform(value, conf:ConfigurableEntityConfigSettingValue<TransformerConfigSetting>) {
    if (!Array.isArray(conf)) conf = [conf]
    conf.forEach(conf => {
      let id = typeof conf === 'string' ? conf : conf.type
      let func = this.transformers[id]
      if (!func) throw new Error(`transfomers.${id} does not exist!`)
      let fn = func.fn
      if (!fn) throw new Error(`transformers.${id}.fn does not exist!`)
      let opts
      try {
        if (func?.optionFields) {
          opts = this.getConfigOptionsFromFields(func.optionFields)
          // @ts-ignore
          if (conf?.options) opts = this.mergeConfigOptions(opts, conf.options)
        }
        value = fn(value, opts)
      }
      catch(e) {
        e.message = `${id} : ${e.message}`
        throw e
      }
    })
    return value
  }

  getConfigOptionValue(value) {
    if (typeof value !== 'string' || !value.match(/^\$lists\./)) return value
    let listID = value.replace(/^\$lists\./, '')
    return this.lists[listID]
  }

  getConfigOptionsFromFields(optionFields:{[id:string]:ConfigFieldConfigSetting}):ConfigSetting {
    let options:ConfigSetting = Object.assign({}, Object.fromEntries(Object.entries(optionFields).map(([id,optionFieldConf]) => {
      if (optionFieldConf.fields) return [id, this.getConfigOptionsFromFields(optionFieldConf.fields)]
      return [id, this.getConfigOptionValue(optionFieldConf.default)]
    })))
    return options
  }

  mergeConfigOptions(options1:ConfigSetting, ...optionsAll:Array<string|ConfigSetting>):ConfigSetting {
    let options = cloneDeep(options1)
    optionsAll.forEach(options2 => {
      if (typeof options2 !== 'string') mergeWith(options, options2, (a,b) => {
        let valueA = this.getConfigOptionValue(a)
        let valueB = this.getConfigOptionValue(b)
        if (Array.isArray(valueA) || Array.isArray(valueB)) return valueB
      })
    })
    return options
  }

  getWidgetFields(
    fieldgroup:FieldableEntity,
    vars:{ values:any, errors:any, touched:any, id?:string },
  ):WidgetFieldFieldgroup {
    let c = cloneDeep(fieldgroup) || { id:'temp', fields: {} }
    // @ts-ignore
    c.eventListeners = []
    Object.keys(c?.fields || {}).forEach(id => {
      // @ts-ignore (this is a type check)
      if (!c.fields[id]?.values) c.fields[id] = new Field(id, c.fields[id], this)
      this.initializeContentField(c.fields[id], {...vars, id})
      // @ts-ignore
      c.fields[id].events?.forEach(e => c.eventListeners.push(e))
    })
    // @ts-ignore
    return c
  }

  findFields(
    fields:{[id:string]:Field},
    query:{[path:string]:string|number|boolean}|((item:Field)=>boolean),
    prefix=''
  ):string[] {
    let foundFields:string[] = []
    Object.entries(fields).forEach(([id,field]) => {
      let newID = [prefix, id].filter(Boolean).join('.')
      let matchingFields = field.fields ? this.findFields(field.fields, query, newID) : []
      foundFields.push(...matchingFields)
      if (query instanceof Function) {
        if (query(field)) foundFields.push(newID)
      }
      else if (!Object.entries(query).reduce((skip, [prop, value]) => {
        return skip || !isEqual(getProp(field, prop), value)
      }, false)) foundFields.push(newID)
    })
    return foundFields
  }

  initializeContentField(field:Field, vars:{ values:any, errors:any, touched:any, id?:string }) {
    field.values = vars?.values || {}
    field.errors = vars?.errors || {}
    field.touched = vars?.touched || {}
    FieldPropsAllowFunctions.forEach(prop => {
      let func = getProp(field, prop)
      if (func?.function && typeof func.function === 'string') {
        this.initializeFunction(field, prop, {...vars, field})
      }
    })
    // @ts-ignore
    field.events = field?.events?.map(e => { return {
      on: e.on,
      id: vars.id,
      function: new ScriptFunction(e.function, {...vars, field}, this)
    }})

    if (field.widget.options) this.initializeConfigOptions(field.widget.options, {...vars, field})
  }

  /**
   * Converts an object property (e.g. on a Field or an options object) into a getter which runs
   * one of the available functions.
   * @param obj The object on which the property is to be defined
   * @param prop The name of the property
   * @param vars The vars object for the defined function
   */
  initializeFunction(obj:{[key:string]:any}, prop:string, vars:{ field:Field, values:any, errors:any, touched:any, id?:string }) {
    let conf = cloneDeep(getProp(obj, prop))
    // console.log({name:'preInitializeFunction', obj, prop, conf:cloneDeep(conf)}) // debug functions
    let func = new ScriptFunction(conf, vars, this)
    // special case for the function that only runs once
    let parentPath = prop.replace(/(?:(?:^|\.)[^\.]+|\[[^\]]\])$/, '')
    let propPath = prop.replace(/^.+\./, '')
    let parent = parentPath.length ? getProp(obj, parentPath) : obj
    if (func.id === 'once') {
      parent[propPath] = func.fn({...vars, cms:this}, func.options)
    }
    else {
      Object.defineProperty(parent, propPath, {
        get: () => {
          let result = func.fn({...vars, cms:this}, func.options)
          // console.log({ name:'run', result, vars, func }) // debug functions
          return result
        }
      })
    }
    // console.log({name:'postInitializeFunction',obj,conf:cloneDeep(conf),func,parentPath,propPath,parent,vars}) // debug functions
  }

  initializeConfigOptions(options, vars:{ field:Field, values:any, errors:any, touched:any, id?:string }) {
    // console.log({name:'initializeConfigOptions', count:Object.keys(options).length, options:cloneDeep(options)}) // debug functions
    Object.keys(options).forEach(k => {
      options[k] = parseScript(options[k]) ?? options[k]
      if (options[k]?.function && typeof options[k]?.function === 'string') {
        this.initializeFunction(options, k, vars)
      }
      else if (Array.isArray(options[k])) {
        for (let i=0; i<options[k].length; i++) {
          if (options[k][i]?.function && typeof options[k][i].function === 'string') {
            this.initializeFunction(options[k], i.toString(), vars)
          }
        }
      }
    })
  }

  // getValidator(typeID:string, values:Object):Validator.Validator<Object> {
  //   let contentType = this.contentTypes[typeID]
  //   let conf = this.getValidatorConfig(contentType.fields)
  //   return new Validator(values, conf)
  // }

  // getValidatorConfig(fieldset:{[id:string]:Field}):Rules {
  //   let configValues = {}
  //   Object.keys(fieldset).forEach(k => {
  //     if (fieldset[k]?.fields) configValues[k] = this.getValidatorConfig(fieldset[k].fields)
  //     else configValues[k] = fieldset[k].validator
  //     if (configValues[k] && fieldset[k]?.multiple) configValues[k] = [configValues[k]]
  //   })
  //   return configValues
  // }

  getAdminPage(path:string):AdminPage {
    let pathArray = path.replace(/(^\/|\/$)/g,'').split('/')
    path = pathArray.join('/')
    if (this.adminPages[path]) return new AdminPage(this.adminPages[path], this)
    for (let i=pathArray.length-1; i>0; i--) {
      pathArray[i] = '*'
      path = pathArray.join('/')
      if (this.adminPages[path]) return new AdminPage(this.adminPages[path], this)
    }
  }

  // @todo: replace this with getEntityConfig
  getInstanceOptions(entityType:ConfigurableEntityType, conf:string|ConfigurableEntityConfigSetting = { type:'' }):ConfigSetting {
    return this.mergeConfigOptions(
      (entityType.optionFields ? this.getConfigOptionsFromFields(entityType.optionFields || {}) : {}),
      entityType.options || {},
      conf?.['options'] || {},
      (typeof conf === 'string' ? {} : conf)
    )
  }

  /**
   * Recursive helper function to get the descendant configuration from an entity object
   * @param entity An Entity object
   * @param options A list of options to retreive from the entity
   * @returns
   */
  _getEntityConfig(entity:any, options:string[]):ConfigSetting {
    if (!entity) return {}
    return {
      ...this._getEntityConfig(entity._parent, options),
      ...Object.fromEntries(options.filter(k => entity?.hasOwnProperty(k)).map(k => ([ k, entity?.[k] ])))
    }
  }

  /**
   * Get the full config setting for a particular entity
   * @param type The Entity Type, e.g. 'field'
   * @param id The ID of the particular entity to get
   * @param parentOnly If true, the config for the current entity will be ignored
   * @returns ConfigSetting
   */
  getEntityConfig(type:string, id:string, parentOnly=false):ConfigSetting {
    if (!type || !id) return {}
    let fields = this.getEntityConfigFields(type, id) || {}
    let options = Object.keys(fields)
    let entity = this.getEntity(type, id)
    return {
      ...this.getConfigOptionsFromFields(fields),
      ...this._getEntityConfig(parentOnly ? entity._parent : entity, options)
    }
  }

  /**
   * Get the list of configuration fields for a specific object
   * @param type The Entity Type, e.g. 'field'
   * @param id The ID of a specific entity
   * @returns An object whose values are ConfigFieldConfigSettings
   */
  getEntityConfigFields(type:string, id?:string):{[id:string]:ConfigFieldConfigSetting} {

    // Get the entity type
    if (!type.match(/s$/)) type += 's'
    let entityType = this.getEntityType(type)
    if (!entityType) return

    // Get the configuration fields for the entity type...
    let configFields = entityType.configFields || {}

    // ...add the "fields" configuration if necessary...
    if (entityType?.isFieldable && !type.match(/^fields?$/i)) configFields.fields = {
      type: 'entityList',
      default: undefined,
      helptext: `The Fields for this ${entityType.label}`,
      widget: {
        type: 'entityList',
        options: {
          entityType: 'field',
        }
      }
    }

    // ...add the "display" configuration if necessary...
    if (entityType?.isDisplayable) configFields.displays = {
      type: 'entityList',
      default: undefined,
      helptext: `The Display configuration for this ${entityType.label}.`,
      widget: {
        type: 'entityList',
        options: {
          entityType: 'display',
        }
      }
    }

    // ...and get the root entity
    let entityRoot = this.getEntityRoot(type, id)

    // bail if there is no root entity
    if (!entityRoot) return configFields

    // Check for a particular entity, and bail if there are no optionFields
    if (!entityRoot?.optionFields) return configFields

    // Return the full set of fields.
    // TODO: decide whether optionFields should override configFields (powerful, but care needed) or vice versa (will not break things)
    // TODO: check that this adequately clones the fields, e.g. that optionFields.disabled:text doesn't overwrite configField.disabled for other fields, etc.
    return {
      ...configFields,
      ...entityRoot.optionFields,
    }

  }

  /**
   * Get the full Fieldgroup object for configuring an entity.
   * @param type The Entity Type
   * @param id The Entity ID (needed for option fields)
   * @returns Fieldgroup
   */
  getEntityConfigFieldgroup(type:string, id?:string):Fieldgroup {

    // Get the full field list, but clone the object since we will be setting defaults
    let fields = cloneDeep(this.getEntityConfigFields(type, id))
    if (!fields) return

    // Get the list of options
    let options = Object.keys(fields)

    // Get the options from the parent element
    let defaults = this.getEntityConfig(type, id)

    // Set the defaults for optionFields
    options.forEach(k => { fields[k].default = defaults?.[k] })

    // Return the new fieldgroup
    return new Fieldgroup({
      id:`entity_${type}`,
      fields // This has already been cloned
    }, this)
  }

  get defaultMediaStore():string {
    let k = (Object.keys(this.mediaStores || {}))[0]
    if (!k) throw new Error('CMS has no mediaStores, but one is required by a field')
    return k
  }

  _scriptFunctionHelp
  get scriptFunctionHelp():Array<{
    id:string           // the function id
    helptext?:string    // what the function does
    params: Array<{     // an array of function parameters
      id:string         // the param id
      multiple:boolean  // whether it is multiple
      helptext:string   // helptext for the param
    }>
  }> {
    if (this._scriptFunctionHelp) return this._scriptFunctionHelp
    this._scriptFunctionHelp = Object.keys(this.scriptFunctions)
      .sort()
      .map(id => {
        let fn = this.scriptFunctions[id]
        return {
          id,
          helptext: fn.description || '',
          params: Object.entries(fn.optionFields || {})
            .map(([id, param]) => {
              return {
                id,
                multiple: param.multiple,
                helptext: param.helptext
              }
            }),
        }
      })
    return this._scriptFunctionHelp
  }

  get displayModes() {
    return uniq([...defaultDisplayModes, ...Object.keys(this.defaultContentDisplays || {})])
  }

  /**
   * Normalize the EntityDisplayConfigSetting into an object with any necessary display modes.
   * @param {string|false|undefined|DisplayConfigSetting|{[id:string]:DisplayConfigSetting}} conf
   *  The contents of the "displays" prop for a configurable object.
   * @returns {EntityDisplayConfig}
   * | Value type                         | Returns |
   * | -----                              | ------- |
   * | undefined                          | {}      |
   * | string                             | { [(...cms.displayModes):string]:value } |
   * | boolean                            | { [(...cms.displayModes):string]:value } |
   * | {type:any,[id:string]:any}         | { [(...cms.displayModes):string]:value } |
   * | {[id:string]:DisplayConfigSetting} | value |
   */
  parseEntityDisplayConfigSetting(conf:EntityDisplayConfigSetting):{[id:string]:DisplayConfigSetting} {

    // If the conf is undefined, it shouldn't change other configurations
    if (typeof conf === 'undefined') return {}

    // @ts-ignore Edge case for manual config where someone types "displays: false"
    if (typeof conf === 'boolean') conf = conf.toString()

    // If the conf is a single display mode, it covers ALL display modes.
    // @ts-ignore for some reason, the boolean check above causes typescript to complain about this, but I think it's right
    if ( typeof conf === 'string' || isDisplayConfig(conf) ) return Object.fromEntries(this.displayModes.map(m => [m,conf]))

    // If the conf has a default, it covers ALL display modes not overridden in the same conf.
    if (conf.hasOwnProperty('default')) return Object.fromEntries(
      this.displayModes.map(m => [m, conf[m] ?? conf['default']])
    )

    // Otherwise the config is already an EntityDisplayConfig
    return conf

  }

}

export type WidgetField = Field & {
  label:string
  helptext?:string
  required?:boolean,
  disabled?:boolean,
  hidden?:boolean,
  class:string,
  multiple?:boolean,
  multipleLabel?:boolean,
  multipleMin?:number
  multipleMax?:number
}

export type WidgetFieldFieldgroup = {
  fields: {[id:string]: WidgetField}
  [key:string]:any
}

/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export function getConfigPathFromValuePath(path:string):string {
  return 'fields.' + path.replace(/\[\d+\]/g,'').replace(/\./g, '.fields.')
}

/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export type ConfigSetting = {[key:string]: string|number|boolean|null|undefined|ConfigSetting|Array<string|number|ConfigSetting>}
export type EntityConfigSetting = ConfigSetting & {
  id?:string
  type?:string
}

export type CMSListConfig = {[key:string]: Array<string|number|{id:string|number,value:any}>}