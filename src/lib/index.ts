import { AdminPage, type AdminPageConfig } from './core/AdminPage'
import { Field, fieldTypes, type FieldType, type FieldConfigSetting, type ConfigFieldConfigSetting } from './core/Field'
import { widgetTypes, type WidgetType, type WidgetConfigSetting } from './core/Widget'
import { ContentType, type ContentTypeConfigSetting } from "./core/ContentType"
import type { MediaStoreType, MediaStoreConfigSetting } from './core/MediaStore'
import type { ContentStoreConfigSetting, ContentStoreType } from './core/ContentStore'
import type { CollectionConfigSetting, AdminCollectionConfigSetting } from './core/Collection'
import { transformers, type Transformer, type TransformerConfigSetting } from './core/Transformer'
import { FieldFunction, fieldFunctions, type FieldFunctionType, type FieldFunctionConfigSetting } from './core/FieldFunction'
import type { ComponentType, ComponentConfigSetting } from './core/Component'

import staticFilesPlugin from 'sveltecms/plugins/staticFiles'
import { cloneDeep, mergeWith, get as getProp, union } from 'lodash-es'

// import { default as Validator, Rules } from 'validatorjs'

const splitter = /\s*,\s*/g

export const FieldPropsAllowFunctions = [
  'label', 'tooltip', 'required', 'disabled',
  'hidden', 'class', 'default', 'value',
  'collapsible', 'collapsed',
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

export type ConfigurableEntityConfigSetting = ConfigSetting & {
  options?:ConfigSetting
}

export type LabeledEntity = {
  label:string
}

export type FieldableEntity = {
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
  adminStore?:string|ContentStoreConfigSetting
  types?: {[key:string]: ContentTypeConfigSetting}
  lists?: {[key:string]: string|(string|number|{id:string|number, value:ConfigSetting})[]}
  contentStores?: {[key:string]: ContentStoreConfigSetting}
  mediaStores?: {[key:string]: MediaStoreConfigSetting}
  fields?: {[key:string]: FieldConfigSetting}
  widgets?: {[key:string]: WidgetConfigSetting}
  collections?: {[key:string]: CollectionConfigSetting}
  transformers?: {[key:string]: TransformerConfigSetting}
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
  fieldFunctions:{[key:string]:FieldFunctionType} = fieldFunctions
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
    plugins.forEach(p => this.use(p))

    // Build out config for the lists
    // This must happen before the content types and fields are built, as fields may have values in $lists
    Object.entries(conf?.lists || []).forEach(([key,list]) => {
      if (typeof list === 'string') this.lists[key] = list.split(splitter)
      else this.lists[key] = list
    });

    // Initialize all of the stores, widgets, and transformers specified in config
    ['contentStores', 'mediaStores', 'transformers'].forEach(objectType => {
      if (conf?.[objectType]) {
        Object.entries(conf[objectType]).forEach(([k,settings]) => {

          // config can:
          // - create a new item (`conf.widgetTypes.newItem = ...`)
          // - modify an existing item (`conf.widgetTypes.text = ...`)
          // - create a new item based on an existing item (`conf.widgetTypes.longtext = { type:"text", ... })
          const type = conf[objectType][k].type || conf[objectType][k].id || k

          // we merge all of the following
          this[objectType][type] = this.mergeConfigOptions(
            // the base item of this type
            cloneDeep(this[objectType][type] || {}),
            // the config item
            // @ts-ignore
            settings,
            // the config item, as a set of options (for shorthand)
            { options: settings }
          )

        })
      }
    });

    ['fields', 'widgets'].forEach(objectType => {
      if (conf?.[objectType]) this[objectType] = {...conf[objectType]}
    })

    if (conf.collections) {
      Object.entries(conf.collections).forEach(([id,conf]) => {
        // @ts-ignore - this is a type check
        if (conf.admin) this.adminCollections[conf.id] = conf
        else this.collections[conf.id] = conf
      })
    }

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

    ['fieldTypes','widgetTypes','transformers','contentStores','mediaStores','lists','adminPages','components'].forEach(k => {
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

    Object.entries(plugin?.fieldWidgets || {}).forEach(([fieldTypeID, widgetTypeIDs]) => {
      widgetTypeIDs.forEach(id => this.widgetTypes[id].fieldTypes.push(fieldTypeID))
    })

    plugin?.collections?.forEach((conf:CollectionConfigSetting) => {
      // @ts-ignore - this is a type check
      if (conf.admin) this.adminCollections[conf.id] = conf
      else this.collections[conf.id] = conf
    })

  }

  preMount(container:ContentType|Field, values:Object) {
    let res = {}
    Object.entries(container.fields).forEach(([id,field]) => {
      try {
        if (field?.fields && values?.[id]) {
          if (Array.isArray(values[id])) {
            res[id] = []
            for (let i=0;i<values[id].length;i++) {
              res[id][i] = this.preMount(field, values[id][i])
            }
          }
          else res[id] = this.preMount(field, values?.[id])
        }
        else res[id] = this.doTransforms('preMount', field, this.doTransforms('preSave', field, values?.[id]))
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    })
    res['_slug'] = values['_slug']
    return res
  }

  preSave(container:ContentType|Field, values:Object) {
    let res = {}
    Object.entries(container.fields).forEach(([id,field]) => {
      try {
        if (field?.fields && values[id]) {
          res[id] = []
          if (Array.isArray(values[id])) {
            for (let i=0;i<values[id].length;i++) {
              res[id][i] = this.preSave(field, values[id][i])
            }
          }
          else res[id] = this.preSave(field, values?.[id])
        }
        else res[id] = this.doTransforms('preSave', field, values?.[id])
      }
      catch(e) {
        e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`
        throw e
      }
    })
    res['_slug'] = values['_slug']
    return res
  }

  doTransforms(op:'preSave'|'preMount', field:Field, value:any) {
    try {
      if (field[op] && field[op].length && value !== undefined && value !== null) {
        field[op].forEach((functionConfig:TransformerConfigSetting) => {
          if (Array.isArray(value)) value = value.map(v => this.runFunction('transformers', functionConfig, v))
          else value = this.runFunction('transformers', functionConfig, value)
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
          'fieldFunctions',
          'mediaStores',
          'transformers',
          'types',
          'widgets',
        ]
    }
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

  getContentType(contentType:string):ContentType {
    if (!this.types[contentType]) throw new Error (`Content type not found: ${contentType}`)
    return this.types[contentType]
  }

  getCollection(contentType:string|ContentType, valuePath:string):Field {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    let configPath = getConfigPathFromValuePath(valuePath)
    let field = <Field> getProp(contentType, configPath)
    if (!field || !(field?.type === 'collection') || !(field?.fields)) throw new Error (`${contentType}.${configPath} is not a valid collection`)
    return field
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
    let newSlug = contentType.slug.fields.map(id => { return getProp(content,id) }).filter(Boolean).join(contentType.slug.separator)
    return this.runFunction('transformers', contentType.slug.slugify, newSlug)
  }

  async listContent(contentType:string|ContentType, options:{load?:boolean, [key:string]:any} = {}):Promise<Array<any>> {
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
   * The text slug for an individual piece of content (optional)
   * If null or omitted, then all content of the type will be returned
   * @param options object
   * @returns object|object[]
   */
  async getContent(contentType:string|ContentType, slug?:string|number|null, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    const rawContent = await db.getContent(contentType, db.options, slug)
    if (!rawContent) return
    this.slugifyContent(rawContent, contentType)
    if (options.getRaw) return rawContent
    // @ts-ignore contentType has by now been type checked
    return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : this.preMount(contentType, rawContent)
  }

  async saveContent(contentType:string|ContentType, content:any, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.saveContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
  }

  async deleteContent(contentType:string|ContentType, content:any, options:{[key:string]:any} = {}) {
    contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType
    const db = this.getContentStore(contentType)
    Object.assign(db.options, options)
    return db.deleteContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options)
  }

  runFunction(functionType:'transformers'|'contentStorage'|'mediaStorage', conf:string|TransformerConfigSetting, value) {
    let id = typeof conf === 'string' ? conf : conf.id
    let func = this[functionType][id]
    if (!func) throw new Error(`${functionType}.${id} does not exist!`)
    let fn = func.fn
    if (!fn) throw new Error(`${functionType}.${id}.fn does not exist!`)
    let opts
    try {
      if (func?.optionFields) {
        opts = this.getConfigOptionsFromFields(func.optionFields)
        // @ts-ignore
        if (conf?.options) opts = this.mergeConfigOptions(opts, conf.options)
      }
      return fn(value, opts)
    }
    catch(e) {
      e.message = `${id} : ${e.message}`
      throw e
    }
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

  getInstanceOptions(entityType:ConfigurableEntityType, conf:string|ConfigurableEntityConfigSetting = {}):ConfigSetting {
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
    Object.keys(c.fields).forEach(id => {
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
      function: new FieldFunction(e.function, {...vars, field}, this)
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
    let func = new FieldFunction(conf, vars, this)
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

  get defaultMediaStore():string {
    let k = (Object.keys(this.mediaStores || {}))[0]
    if (!k) throw new Error('CMS has no mediaStores, but one is required by a field')
    return k
  }

}

export type WidgetField = Field & {
  label:string
  tooltip?:string
  required?:boolean,
  disabled?:boolean,
  hidden?:boolean,
  class:string,
  collapsible?:boolean,
  collapsed?:boolean,
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
export type ConfigSetting = {[key:string]: string|string[]|number|boolean|null|undefined|ConfigSetting|Array<ConfigSetting>}

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
