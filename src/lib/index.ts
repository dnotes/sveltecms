import { AdminPage, type AdminPageConfig } from './core/AdminPage'
import { Field, fieldTypes, type FieldType, type FieldConfigSetting, type ConfigFieldConfigSetting } from './core/Field'
import { widgetTypes, type WidgetType, type WidgetConfigSetting } from './core/Widget'
import { ContentType, type ContentTypeConfigSetting } from "./core/ContentType"
import type { MediaStoreType, MediaStoreConfigSetting } from './core/MediaStore'
import type { Content, ContentStoreConfigSetting, ContentStoreType } from './core/ContentStore'
import { type CollectionConfigSetting, type AdminCollectionConfigSetting, Collection, collectionTypes } from './core/Collection'
import { transformers, type Transformer, type TransformerConfigSetting } from './core/Transformer'
import { ScriptFunction, scriptFunctions, type ScriptFunctionType, type ScriptFunctionConfigSetting } from './core/ScriptFunction'
import type { ComponentType, ComponentConfigSetting, Component } from 'sveltecms/core/Component'
import { displayComponents, type DisplayConfigSetting } from 'sveltecms/core/Display'

import staticFilesPlugin from 'sveltecms/plugins/staticFiles'
import { cloneDeep, mergeWith, get as getProp, union } from 'lodash-es'

// import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export const FieldPropsAllowFunctions = [
  'label', 'helptext', 'required', 'disabled',
  'hidden', 'class', 'default', // TODO: 'value',
  'multiple', 'multipleLabel', 'multipleMin', 'multipleMax',
]

export const cmsConfigurables = [
  'adminStore',
  'types',
  'lists',
  'contentStores',
  'mediaStores',
  'fields',
  'widgets',
  'collections',
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
  label:string
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

export type EntityType = {
  id:string
}

export type ConfigurableEntityType = EntityType & {
  optionFields?:{[key:string]:ConfigFieldConfigSetting}
  options?:ConfigSetting
}

export type CMSConfigSetting = {
  configPath?:string
  settings?:ConfigSetting
  adminStore?:string|ContentStoreConfigSetting
  types?: {[key:string]: ContentTypeConfigSetting}
  lists?: {[key:string]: string|(string|number|{id:string|number, value:ConfigSetting})[]}
  contentStores?: {[key:string]: ContentStoreConfigSetting}
  mediaStores?: {[key:string]: MediaStoreConfigSetting}
  fields?: {[key:string]: FieldConfigSetting}
  widgets?: {[key:string]: WidgetConfigSetting}
  collections?: {[key:string]: CollectionConfigSetting}
  transformers?: {[key:string]: TransformerConfigSetting}
  components?: {[key:string]: ComponentConfigSetting}
}

export default class SvelteCMS {

  conf:CMSConfigSetting = {}
  admin: ContentType
  adminPages?: {[key:string]:AdminPageConfig} = {}
  adminCollections?: {[key:string]:AdminCollectionConfigSetting} = {}
  fields:{[key:string]:FieldConfigSetting} = {}
  collections: {[key:string]:CollectionConfigSetting} = {}
  components: {[key:string]:ComponentType} = {}
  widgets:{[key:string]:WidgetConfigSetting} = {}
  scriptFunctions:{[key:string]:ScriptFunctionType} = scriptFunctions
  fieldTypes:{[key:string]:FieldType} = fieldTypes
  widgetTypes:{[key:string]:WidgetType} = widgetTypes
  transformers:{[key:string]:Transformer} = transformers
  contentStores:{[key:string]:ContentStoreType} = {}
  mediaStores:{[key:string]:MediaStoreType} = {}
  types:{[key:string]:ContentType} = {}
  lists:CMSListConfig = {}
  constructor(conf:CMSConfigSetting, plugins:CMSPlugin[] = []) {

    this.conf = conf
    this.use(staticFilesPlugin)
    displayComponents.forEach(c => {
      this.components[c.id] = c
    })
    collectionTypes.forEach(c => {
      this.collections[c.id] = c
    })
    plugins.forEach(p => this.use(p))

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists || []).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    });

    // Initialize all of the stores, widgets, and transformers specified in config
    ['contentStores', 'mediaStores', 'transformers', 'components', 'collections'].forEach(objectType => {
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
            { id, options: settings }
          )

        })
      }
    });

    ['fields', 'widgets'].forEach(objectType => {
      if (conf?.[objectType]) this[objectType] = {...conf[objectType]}
    })

    // Build out config for the content types
    Object.entries(conf?.types || {}).forEach(([id,conf]) => {
      this.types[id] = new ContentType(id, conf, this)
    });

    let adminStore = conf.adminStore || conf.configPath || 'src/sveltecms.config.json'
    if (typeof adminStore === 'string') {
      let contentDirectory = adminStore.replace(/\/[^\/]+$/, '')
      let fileExtension = adminStore.replace(/.+[\.]/, '')
      if (!['json','yml','yaml'].includes(fileExtension)) throw new Error('adminStore must end in .json, .yml, or .yaml.')
      adminStore = {
        type: 'staticFiles',
        options: {
          prependContentTypeIdAs: '',
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
        ...Object.fromEntries(cmsConfigurables.map(k => [k, 'collection']))
      }
    }, this)

  }

  use(plugin:CMSPlugin, config?:any) {
    // TODO: allow function that returns plugin

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists','adminPages','components','collections'].forEach(k => {
      plugin?.[k]?.forEach(conf => {
        try {
          this[k][conf.id] = conf
        }
        catch(e) {
          console.error(this)
          throw e
        }
      })
    });

    // This allows plugins to update existing widgets to work with provided fields. See markdown plugin.
    Object.entries(plugin?.fieldWidgets || {}).forEach(([fieldTypeID, widgetTypeIDs]) => {
      widgetTypeIDs.forEach(id =>{ if (!this.widgetTypes[id].fieldTypes.includes(fieldTypeID)) this.widgetTypes[id].fieldTypes.push(fieldTypeID) })
    })

  }

  preMount(fieldableEntity:ContentType|Field|Collection, values:Object) {
    let res = {} // variable for result
    Object.entries(fieldableEntity?.fields || {}).forEach(([id,field]) => {
      try {
        // For collections, or other fieldable field types (e.g. possibly image)
        if ((field.type === 'collection' || field?.fields) && values?.[id]) {
          if (Array.isArray(values[id])) {
            res[id] = []
            for (let i=0;i<values[id].length;i++) {
              // find the actual fields, in case it is a collection that can be selected on the widget during editing
              let container = values[id][i]._collectionType ? new Collection(values[id][i]._collectionType, this) : field
              res[id][i] = this.preMount(container, values[id][i])
            }
          }
          else {
            let container = values[id]._collectionType ? new Collection(values[id]._collectionType, this) : field
            res[id] = this.preMount(container, values?.[id])
          }
        }
        else res[id] = this.doFieldTransforms('preMount', field, this.doFieldTransforms('preSave', field, values?.[id]))
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    })
    // Pass on CMS-specific items like _slug (beginning with _)
    Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k])
    return res
  }

  preSave(fieldableEntity:ContentType|Field|Collection, values:Object) {
    let res = {}
    Object.entries(fieldableEntity?.fields || {}).forEach(([id,field]) => {
      try {
        // For collections (as above)
        if ((field.type === 'collection' || field?.fields) && values?.[id]) {
          res[id] = []
          if (Array.isArray(values[id])) {
            for (let i=0;i<values[id].length;i++) {
              // find the actual fields, in case it is a collection that can be selected on the widget during editing
              let container = values[id][i]._collectionType ? new Collection(values[id][i]._collectionType, this) : field
              res[id][i] = this.preSave(container, values[id][i])
            }
          }
          else {
            let container = values[id]._collectionType ? new Collection(values[id]._collectionType, this) : field
            res[id] = this.preSave(container, values?.[id])
          }
        }
        else res[id] = this.doFieldTransforms('preSave', field, values?.[id])
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
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

  listEntities(type:string, includeAdmin?:boolean, arg?:string):string[] {
    switch (type) {
      case 'fields':
        return this.getFieldTypes()
      case 'widgets':
        return this.getFieldTypeWidgets(arg)
      case 'fieldTypes':
      case 'widgetTypes':
      case 'types':
      case 'lists':
      case 'contentStores':
      case 'mediaStores':
      case 'collections':
      case 'transformers':
      case 'components':
        return Object.keys(this[type]).filter(k => (includeAdmin || !this[type][k]?.['admin']))
      default:
        return [
          'adminPages',
          'collections',
          'adminCollections',
          'components',
          'contentStores',
          'fields',
          'scriptFunctions',
          'mediaStores',
          'transformers',
          'types',
          'widgets',
        ]
    }
  }

  getEntity(type:string, id:string) {
    if (!type || !id) return
    if (type === 'fields' || type === 'field') return this.fields[id] ?? this.fieldTypes[id]
    if (type === 'widgets' || type === 'widget') return this.widgets[id] ?? this.widgetTypes[id]
    return this?.[type]?.[id]
  }

  getEntityParent(type:string, id:string) {
    if (!type || !id) return
    if (type === 'fields' || type === 'field') return this.fields[id] ?? this.fieldTypes[id]
    if (type === 'widgets' || type === 'widget') return this.widgets[id] ?? this.widgetTypes[id]
    return this?.[type]?.[id]
  }

  getEntityType(type:string, id:string) {
    if (!type || !id) return
    if (type === 'fields') return this.fieldTypes[id] || this.getEntityType('fields', this.fields?.[id]?.['type'])
    if (type === 'widgets') return this.widgetTypes[id] || this.getEntityType('widgets', this.widgets?.[id]?.['type'])
    let entityType = this?.[type]?.[id]
    if (!entityType?.type || entityType?.type === entityType?.id) return entityType
    return this.getEntityType(type, entityType?.type)
  }

  getFieldTypes() {
    return union(Object.keys(this.fieldTypes || {}), Object.keys(this.fields || {}))
  }

  getFieldTypeWidgets(fieldType) {
    if (!fieldType) return union(
      Object.keys(this.widgetTypes || {}).filter(k => !this.widgetTypes[k].admin),
      Object.keys(this.widgets || {})
    )
    return union(
      Object.keys(this.widgetTypes).filter(k => !this.widgetTypes[k].admin && this.widgetTypes[k].fieldTypes.includes(fieldType)),
      Object.keys(this.widgets).filter(k => this.widgetTypes[this.widgets[k].type].fieldTypes.includes(fieldType))
    )
  }

  getDisplayComponent(display:string|DisplayConfigSetting, fallback:string='field_element'):Component|ComponentType {
    let id = typeof display === 'string' ? display : (display?.type || display?.id)
    if (!id) return
    return this.components[id] || this.components[fallback]
  }

  getContentType(contentType:string):ContentType {
    if (!this.types[contentType]) throw new Error (`Content type not found: ${contentType}`)
    return this.types[contentType]
  }

  getContentStore(contentType:string|ContentType) {
    const type = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    return type.contentStore
  }

  slugifyContent(content:any, contentType:ContentType, force?:boolean) {
    if (Array.isArray(content)) {
      content.forEach(c => {
        c._slug = this.getSlug(c, contentType, force)
      })
    }
    else {
      content._slug = this.getSlug(content, contentType, force)
    }
    return content
  }

  getSlug(content:any, contentType:ContentType, force:boolean) {
    if (content._slug && !force) return content._slug
    return contentType.slug.fields
      .map(id => getProp(content,id))
      .filter(value => typeof value !== 'undefined')
      .map(value => this.transform(value, contentType.slug.slugify))
      .join(contentType.slug.separator)
  }

  async listContent(contentType:string|ContentType, options:{load?:boolean, [key:string]:any} = {}):Promise<Content[]> {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    const rawContent = await db.listContent(contentType, db.options)
    if (!rawContent) return
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    // @ts-ignore contentType has by now been type checked
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : [this.preMount(contentType, rawContent)]
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
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    let rawContent = await db.getContent(contentType, db.options, slug)
    if (!rawContent || (Array.isArray(rawContent) && !rawContent.length)) return
    if (Array.isArray(rawContent)) rawContent = rawContent.find(item => item._slug === slug) || rawContent[0]
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    // @ts-ignore contentType has by now been type checked
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : this.preMount(contentType, rawContent)
  }

  async saveContent(contentType:string|ContentType, content:any, options:{[key:string]:any} = {}):Promise<Content> {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.saveContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
  }

  async deleteContent(contentType:string|ContentType, content:any, options:{[key:string]:any} = {}):Promise<Content> {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.deleteContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
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

  getInstanceOptions(entityType:ConfigurableEntityType, conf:string|ConfigurableEntityConfigSetting = { type:'' }):ConfigSetting {
    return this.mergeConfigOptions(
      (entityType.optionFields ? this.getConfigOptionsFromFields(entityType.optionFields || {}) : {}),
      entityType.options || {},
      conf?.['options'] || {},
      (typeof conf === 'string' ? {} : conf)
    )
  }

  getWidgetFields(
    collection:FieldableEntity,
    vars:{ values:any, errors:any, touched:any, id?:string },
  ):WidgetFieldCollection {
    let c = cloneDeep(collection)
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
      if (options[k]?.function && typeof options[k]?.function === 'string') {
        this.initializeFunction(options, k, vars)
      }
    })
  }

  // getValidator(typeID:string, values:Object):Validator.Validator<Object> {
  //   let contentType = this.types[typeID]
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

  getEntityConfig(type:string, id:string, options?:string[]) {
    if (!type || !id) return
    if (!options) {
      options = Object.keys((this.getEntityType(type, id))?.optionFields ?? {})
      if (!options) return {}
    }
    let entity = this.getEntity(type, id)
    return {
      // the entity config of the parent (recursive)
      ...(this.getEntityConfig(type, entity?.[type], options) ?? {}),
      // the entity config of the parent's optionFields (if it is an entityType)
      ...(this.getConfigOptionsFromFields(entity?.optionFields ?? {})),
      // any options written directly into the entity config, e.g. in a ConfigurableEntityConfigSetting
      ...(Object.fromEntries(options.filter(k=>entity?.hasOwnProperty(k)).map(k => ([ k, entity?.[k] ]) ))),
      // the options, e.g. in a ConfigurableEntity
      ...(entity?.options || {}),
    }
  }

  getEntityConfigCollection(type:string, id:string) {
    let entityType = this.getEntityType(type, id)
    // Check that there are option fields, otherwise it's moot
    if (!entityType?.optionFields) return new Collection({ id:`entityType_${type}`, fields:{} }, this)
    // Clone the optionFields so that we can change the default values
    let optionFields = Object.assign({}, entityType.optionFields)
    // Get a list of options
    let options = Object.keys(optionFields)
    // Get the options from the parent element
    let defaults = this.getEntityConfig(type, id, options)
    // Set the defaults for optionFields
    options.forEach(k => { optionFields[k].default = defaults[k] })
    return new Collection({
      id:`entityType_${type}`,
      fields: optionFields,
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
          helptext: fn.helptext || '',
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

export type WidgetFieldCollection = {
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

export type CMSPlugin = {
  adminPages?: AdminPageConfig[]
  fieldTypes?: FieldType[]
  widgetTypes?: WidgetType[]
  transformers?: Transformer[]
  contentStores?: ContentStoreType[]
  mediaStores?: MediaStoreType[]
  collections?: CollectionConfigSetting[]
  adminCollections?: CollectionConfigSetting[]
  components?: Array<ComponentType|ComponentConfigSetting>
  lists?: CMSListConfig
  optionFields?:{[key:string]:ConfigFieldConfigSetting}
  fieldWidgets?:{[key:string]:string[]}
}

export type CMSPluginBuilder = (config:any) => CMSPlugin

export type CMSListConfig = {[key:string]: Array<string|number|{id:string|number,value:any}>}
