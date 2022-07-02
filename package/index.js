import { AdminPage } from './core/AdminPage';
import { Field, templateField, fieldTypes } from './core/Field';
import { widgetTypes, templateWidget } from './core/Widget';
import { ContentType, templateContentType } from "./core/ContentType";
import { templateMediaStore } from './core/MediaStore';
import { templateContentStore } from './core/ContentStore';
import { Fieldgroup, templateFieldgroup } from './core/Fieldgroup';
import { transformers, templateTransformer } from './core/Transformer';
import { ScriptFunction, scriptFunctions, parseScript } from './core/ScriptFunction';
import { templateComponent } from 'sveltecms/core/Component';
import { displayComponents, templateDisplay } from 'sveltecms/core/Display';
import staticFilesPlugin from 'sveltecms/plugins/staticFiles';
import { cloneDeep, mergeWith, get as getProp, union } from 'lodash-es';
import { templateSlug } from './core/Slug';
// import { default as Validator, Rules } from 'validatorjs'
const splitter = /\s*,\s*/g;
export const FieldPropsAllowFunctions = [
    'label', 'helptext', 'required', 'disabled',
    'hidden', 'class', 'default',
    'multiple', 'multipleLabelFields', 'multipleMin', 'multipleMax',
];
export const cmsConfigurables = [
    'settings',
    'adminStore',
    'contentTypes',
    // 'lists',
    'contentStores',
    'mediaStores',
    'fields',
    'widgets',
    'fieldgroups',
    'transformers'
];
export default class SvelteCMS {
    constructor(conf, plugins = []) {
        this.conf = {};
        this.entityTypes = {
            component: templateComponent,
            contentStore: templateContentStore,
            contentType: templateContentType,
            display: templateDisplay,
            field: templateField,
            fieldgroup: templateFieldgroup,
            mediaStore: templateMediaStore,
            slug: templateSlug,
            transformer: templateTransformer,
            widget: templateWidget,
        };
        this.adminPages = {};
        this.adminFieldgroups = {};
        this.fields = {};
        this.fieldgroups = {};
        this.components = {};
        this.widgets = {};
        this.scriptFunctions = scriptFunctions;
        this.fieldTypes = fieldTypes;
        this.widgetTypes = widgetTypes;
        this.transformers = transformers;
        this.contentStores = {};
        this.mediaStores = {};
        this.contentTypes = {};
        this.lists = {};
        this.conf = conf;
        this.use(staticFilesPlugin);
        displayComponents.forEach(c => {
            this.components[c.id] = c;
        });
        plugins.forEach(p => this.use(p));
        // Build out config for the lists
        // This must happen before the content types and fields are built, as fields may have values in $lists
        Object.entries(conf?.lists || []).forEach(([key, list]) => {
            if (typeof list === 'string')
                this.lists[key] = list.split(splitter);
            else
                this.lists[key] = list;
        });
        // Initialize all of the stores, widgets, and transformers specified in config
        ['contentStores', 'mediaStores', 'transformers', 'components', 'fieldgroups'].forEach(objectType => {
            if (conf?.[objectType]) {
                Object.entries(conf[objectType]).forEach(([id, settings]) => {
                    // config can:
                    // - create a new item (`conf.widgetTypes.newItem = ...`)
                    // - modify an existing item (`conf.widgetTypes.text = ...`)
                    // - create a new item based on an existing item (`conf.widgetTypes.longtext = { type:"text", ... })
                    const type = conf[objectType][id].type || conf[objectType][id].id || id;
                    // we merge all of the following
                    this[objectType][id] = this.mergeConfigOptions(
                    // the base item of this type
                    cloneDeep(this[objectType][type] || {}), 
                    // the config item
                    // @ts-ignore
                    settings, 
                    // the config item, as a set of options (for shorthand)
                    {
                        id,
                        _parent: this[objectType][type],
                        options: settings
                    });
                });
            }
        });
        ['fields', 'widgets'].forEach(objectType => {
            if (conf?.[objectType]) {
                let typesKey = objectType.replace('s', 'Types');
                Object.entries(conf[objectType]).forEach(([id, item]) => {
                    item = typeof item === 'string' ? { type: item } : item;
                    let type = item['type'];
                    if (!type || typeof type !== 'string')
                        throw new Error(`Type is required for ${objectType}.${id} (received ${JSON.stringify(type)})`);
                    let _parent = this[objectType][type] ?? this[typesKey][type];
                    if (!_parent)
                        throw new Error(`Parent not found for ${objectType}.${id}. Is "${id}" a typo? Did you define ${objectType}.${id} before ${objectType}.${item?.['type'] ?? item}?`);
                    // @ts-ignore This has been type checked by now
                    this[objectType][id] = { ...item, _parent };
                });
            }
        });
        // Build out config for the content types
        Object.entries(conf?.contentTypes || {}).forEach(([id, conf]) => {
            this.contentTypes[id] = new ContentType(id, conf, this);
        });
        let adminStore = conf.adminStore || conf.configPath || 'src/sveltecms.config.json';
        if (typeof adminStore === 'string') {
            let contentDirectory = adminStore.replace(/\/[^\/]+$/, '');
            let fileExtension = adminStore.replace(/.+[\.]/, '');
            if (!['json', 'yml', 'yaml'].includes(fileExtension))
                throw new Error('adminStore must end in .json, .yml, or .yaml.');
            adminStore = {
                type: 'staticFiles',
                options: {
                    prependContentTypeIdAs: '',
                    contentDirectory,
                    fileExtension,
                }
            };
        }
        this.admin = new ContentType('admin', {
            label: 'Admin',
            contentStore: adminStore,
            slug: {
                fields: ['configPath'],
                slugify: 'getFilename'
            },
            fields: {
                configPath: 'text',
                ...Object.fromEntries(cmsConfigurables.map(k => [k, 'fieldgroup']))
            }
        }, this);
    }
    use(plugin, config) {
        // TODO: allow function that returns plugin
        ['fieldTypes', 'widgetTypes', 'transformers', 'contentStores', 'mediaStores', 'lists', 'adminPages', 'components', 'fieldgroups'].forEach(k => {
            try {
                plugin?.[k]?.forEach(conf => {
                    this[k][conf.id] = conf;
                });
            }
            catch (e) {
                e.message = `Plugin ${plugin.id} failed loading ${k}\n${e.message}`;
                throw e;
            }
        });
        // This allows plugins to update existing widgets to work with provided fields. See markdown plugin.
        Object.entries(plugin?.fieldWidgets || {}).forEach(([fieldTypeID, widgetTypeIDs]) => {
            widgetTypeIDs.forEach(id => { if (!this.widgetTypes[id].fieldTypes.includes(fieldTypeID))
                this.widgetTypes[id].fieldTypes.push(fieldTypeID); });
        });
    }
    preMount(fieldableEntity, values) {
        let res = {}; // variable for result
        Object.entries(fieldableEntity?.fields || {}).forEach(([id, field]) => {
            try {
                // For fieldgroups, or other fieldable field types (e.g. possibly image)
                if ((field.type === 'fieldgroup' || field?.fields) && values?.[id]) {
                    if (Array.isArray(values[id])) {
                        res[id] = [];
                        for (let i = 0; i < values[id].length; i++) {
                            // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
                            let container = values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field;
                            res[id][i] = this.preMount(container, values[id][i]);
                        }
                    }
                    else {
                        let container = values[id]._fieldgroup ? new Fieldgroup(values[id]._fieldgroup, this) : field;
                        res[id] = this.preMount(container, values?.[id]);
                    }
                }
                else
                    res[id] = this.doFieldTransforms('preMount', field, this.doFieldTransforms('preSave', field, values?.[id]));
            }
            catch (e) {
                e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`;
                throw e;
            }
        });
        // Pass on CMS-specific items like _slug (beginning with _)
        Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k]);
        return res;
    }
    preSave(fieldableEntity, values) {
        let res = {};
        Object.entries(fieldableEntity?.fields || {}).forEach(([id, field]) => {
            try {
                // For fieldgroups (as above)
                if ((field.type === 'fieldgroup' || field?.fields) && values?.[id]) {
                    res[id] = [];
                    if (Array.isArray(values[id])) {
                        for (let i = 0; i < values[id].length; i++) {
                            // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
                            let container = values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field;
                            res[id][i] = this.preSave(container, values[id][i]);
                        }
                    }
                    else {
                        let container = values[id]._fieldgroup ? new Fieldgroup(values[id]._fieldgroup, this) : field;
                        // Any "fieldgroup" fields in content can be static (with "fields" prop) or dynamic, chosen by content editor
                        // We get the new Fieldgroup for the latter case, and either way the container will have "fields" prop.
                        // When saving config, the "fieldgroup" fields will not have a "fields" prop, and must still be saved.
                        // @TODO: Evaluate this for security, and probably fix it, since at the moment it will try to save
                        // almost any value to the configuration, albeit serialized.
                        res[id] = container?.fields ? this.preSave(container, values?.[id]) : values[id];
                    }
                }
                else
                    res[id] = this.doFieldTransforms('preSave', field, values?.[id]);
            }
            catch (e) {
                e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreSave/${field.id} : ${e.message}`;
                throw e;
            }
        });
        Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k]);
        return res;
    }
    doFieldTransforms(op, field, value) {
        try {
            if (field[op] && field[op].length && value !== undefined && value !== null) {
                field[op].forEach((functionConfig) => {
                    if (Array.isArray(value))
                        value = value.map(v => this.transform(v, functionConfig));
                    else
                        value = this.transform(value, functionConfig);
                });
            }
            return value;
        }
        catch (e) {
            e.message = `value: ${JSON.stringify(value, null, 2)}\n${field.id}/${op} : ${e.message}`;
            throw e;
        }
    }
    listEntities(type, includeAdmin, entityID) {
        if (!type.match(/s$/))
            type += 's';
        switch (type) {
            case 'fields':
                return this.getFieldTypes(includeAdmin);
            case 'widgets':
                return this.getFieldTypeWidgets(includeAdmin, entityID);
            case 'fieldTypes':
            case 'widgetTypes':
            case 'contentTypes':
            case 'lists':
            case 'contentStores':
            case 'mediaStores':
            case 'fieldgroups':
            case 'transformers':
            case 'components':
                return Object.keys(this[type]).filter(k => (includeAdmin || !this[type][k]?.['admin']));
            default:
                return [
                    'adminPages',
                    'fieldgroups',
                    'adminFieldgroups',
                    'components',
                    'contentStores',
                    'fields',
                    'scriptFunctions',
                    'mediaStores',
                    'transformers',
                    'contentTypes',
                    'widgets',
                ];
        }
    }
    getEntityType(type) {
        if (this?.entityTypes?.[type])
            return cloneDeep(this?.entityTypes?.[type]);
        if (this?.entityTypes?.[type?.replace(/s$/, '')])
            return cloneDeep(this?.entityTypes?.[type?.replace(/s$/, '')]);
    }
    getEntity(type, id) {
        if (!type || !id)
            return;
        if (!this[type])
            type += 's';
        if (type === 'fields')
            return this.fields[id] ?? this.fieldTypes[id];
        if (type === 'widgets')
            return this.widgets[id] ?? this.widgetTypes[id];
        return this?.[type]?.[id];
    }
    getEntityParent(type, id) {
        if (!type || !id)
            return;
        if (type === 'fields' || type === 'field')
            return this.fields[id] ?? this.fieldTypes[id];
        if (type === 'widgets' || type === 'widget')
            return this.widgets[id] ?? this.widgetTypes[id];
        return this?.[type]?.[id];
    }
    getEntityRoot(type, id) {
        if (!type || !id)
            return;
        if (type === 'fields')
            return this.fieldTypes[id] || this.getEntityRoot('fields', this.fields?.[id]?.['type']);
        if (type === 'widgets')
            return this.widgetTypes[id] || this.getEntityRoot('widgets', this.widgets?.[id]?.['type']);
        let entityType = this?.[type]?.[id];
        if (!entityType?.type || entityType?.type === entityType?.id)
            return entityType;
        return this.getEntityRoot(type, entityType?.type);
    }
    getFieldTypes(includeAdmin) {
        return union(Object.keys(this.fieldTypes || {}).filter(k => includeAdmin || !this.fieldTypes[k].admin), Object.keys(this.fields || {}).filter(k => includeAdmin || !this.fields[k].admin));
    }
    getFieldTypeWidgets(includeAdmin, fieldTypeID) {
        let widgetTypes = Object.keys(this.widgetTypes || {}).filter(k => includeAdmin || !this.widgetTypes[k].admin);
        let widgets = Object.keys(this.widgets || {});
        let fieldTypeRoot = this.getEntityRoot('fields', fieldTypeID);
        if (!fieldTypeID || !fieldTypeRoot)
            return union(widgetTypes, widgets);
        return union(widgetTypes.filter(k => this.widgetTypes[k].fieldTypes.includes(fieldTypeRoot.id)), widgets.filter(k => this.widgetTypes[this.widgets[k].type].fieldTypes.includes(fieldTypeRoot.id)));
    }
    getDisplayComponent(display, fallback = 'field_element') {
        let id = typeof display === 'string' ? display : (display?.type || display?.id);
        if (!id)
            return;
        return this.components[id] || this.components[fallback];
    }
    getContentType(contentType) {
        if (!this.contentTypes[contentType])
            throw new Error(`Content type not found: ${contentType}`);
        return this.contentTypes[contentType];
    }
    getContentStore(contentType) {
        const type = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        return type.contentStore;
    }
    slugifyContent(content, contentType, force) {
        if (Array.isArray(content)) {
            content.forEach(c => {
                c._slug = this.getSlug(c, contentType, force);
            });
        }
        else {
            content._slug = this.getSlug(content, contentType, force);
        }
        return content;
    }
    getSlug(content, contentType, force) {
        if (content._slug && !force)
            return content._slug;
        return contentType.slug.fields
            .map(id => getProp(content, id))
            .filter(value => typeof value !== 'undefined')
            .map(value => this.transform(value, contentType.slug.slugify))
            .join(contentType.slug.separator);
    }
    async listContent(contentType, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        Object.assign(db.options, options);
        const rawContent = await db.listContent(contentType, db.options);
        if (!rawContent)
            return;
        this.slugifyContent(rawContent, contentType);
        if (options.getRaw)
            return rawContent;
        // @ts-ignore contentType has by now been type checked
        return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : [this.preMount(contentType, rawContent)];
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
    async getContent(contentType, slug, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        Object.assign(db.options, options);
        let rawContent = await db.getContent(contentType, db.options, slug);
        if (!rawContent || (Array.isArray(rawContent) && !rawContent.length))
            return;
        if (Array.isArray(rawContent))
            rawContent = rawContent.find(item => item._slug === slug) || rawContent[0];
        this.slugifyContent(rawContent, contentType);
        if (options.getRaw)
            return rawContent;
        // @ts-ignore contentType has by now been type checked
        return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : this.preMount(contentType, rawContent);
    }
    async saveContent(contentType, content, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        Object.assign(db.options, options);
        return db.saveContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options);
    }
    async deleteContent(contentType, content, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        Object.assign(db.options, options);
        return db.deleteContent(this.slugifyContent(this.preSave(contentType, content), contentType), contentType, db.options);
    }
    transform(value, conf) {
        if (!Array.isArray(conf))
            conf = [conf];
        conf.forEach(conf => {
            let id = typeof conf === 'string' ? conf : conf.type;
            let func = this.transformers[id];
            if (!func)
                throw new Error(`transfomers.${id} does not exist!`);
            let fn = func.fn;
            if (!fn)
                throw new Error(`transformers.${id}.fn does not exist!`);
            let opts;
            try {
                if (func?.optionFields) {
                    opts = this.getConfigOptionsFromFields(func.optionFields);
                    // @ts-ignore
                    if (conf?.options)
                        opts = this.mergeConfigOptions(opts, conf.options);
                }
                value = fn(value, opts);
            }
            catch (e) {
                e.message = `${id} : ${e.message}`;
                throw e;
            }
        });
        return value;
    }
    getConfigOptionValue(value) {
        if (typeof value !== 'string' || !value.match(/^\$lists\./))
            return value;
        let listID = value.replace(/^\$lists\./, '');
        return this.lists[listID];
    }
    getConfigOptionsFromFields(optionFields) {
        let options = Object.assign({}, Object.fromEntries(Object.entries(optionFields).map(([id, optionFieldConf]) => {
            if (optionFieldConf.fields)
                return [id, this.getConfigOptionsFromFields(optionFieldConf.fields)];
            return [id, this.getConfigOptionValue(optionFieldConf.default)];
        })));
        return options;
    }
    mergeConfigOptions(options1, ...optionsAll) {
        let options = cloneDeep(options1);
        optionsAll.forEach(options2 => {
            if (typeof options2 !== 'string')
                mergeWith(options, options2, (a, b) => {
                    let valueA = this.getConfigOptionValue(a);
                    let valueB = this.getConfigOptionValue(b);
                    if (Array.isArray(valueA) || Array.isArray(valueB))
                        return valueB;
                });
        });
        return options;
    }
    getWidgetFields(fieldgroup, vars) {
        let c = cloneDeep(fieldgroup) || { id: 'temp', fields: {} };
        // @ts-ignore
        c.eventListeners = [];
        Object.keys(c?.fields || {}).forEach(id => {
            // @ts-ignore (this is a type check)
            if (!c.fields[id]?.values)
                c.fields[id] = new Field(id, c.fields[id], this);
            this.initializeContentField(c.fields[id], { ...vars, id });
            // @ts-ignore
            c.fields[id].events?.forEach(e => c.eventListeners.push(e));
        });
        // @ts-ignore
        return c;
    }
    initializeContentField(field, vars) {
        field.values = vars?.values || {};
        field.errors = vars?.errors || {};
        field.touched = vars?.touched || {};
        FieldPropsAllowFunctions.forEach(prop => {
            let func = getProp(field, prop);
            if (func?.function && typeof func.function === 'string') {
                this.initializeFunction(field, prop, { ...vars, field });
            }
        });
        // @ts-ignore
        field.events = field?.events?.map(e => {
            return {
                on: e.on,
                id: vars.id,
                function: new ScriptFunction(e.function, { ...vars, field }, this)
            };
        });
        if (field.widget.options)
            this.initializeConfigOptions(field.widget.options, { ...vars, field });
    }
    /**
     * Converts an object property (e.g. on a Field or an options object) into a getter which runs
     * one of the available functions.
     * @param obj The object on which the property is to be defined
     * @param prop The name of the property
     * @param vars The vars object for the defined function
     */
    initializeFunction(obj, prop, vars) {
        let conf = cloneDeep(getProp(obj, prop));
        // console.log({name:'preInitializeFunction', obj, prop, conf:cloneDeep(conf)}) // debug functions
        let func = new ScriptFunction(conf, vars, this);
        // special case for the function that only runs once
        let parentPath = prop.replace(/(?:(?:^|\.)[^\.]+|\[[^\]]\])$/, '');
        let propPath = prop.replace(/^.+\./, '');
        let parent = parentPath.length ? getProp(obj, parentPath) : obj;
        if (func.id === 'once') {
            parent[propPath] = func.fn({ ...vars, cms: this }, func.options);
        }
        else {
            Object.defineProperty(parent, propPath, {
                get: () => {
                    let result = func.fn({ ...vars, cms: this }, func.options);
                    // console.log({ name:'run', result, vars, func }) // debug functions
                    return result;
                }
            });
        }
        // console.log({name:'postInitializeFunction',obj,conf:cloneDeep(conf),func,parentPath,propPath,parent,vars}) // debug functions
    }
    initializeConfigOptions(options, vars) {
        // console.log({name:'initializeConfigOptions', count:Object.keys(options).length, options:cloneDeep(options)}) // debug functions
        Object.keys(options).forEach(k => {
            if (options[k]?.function && typeof options[k]?.function === 'string') {
                this.initializeFunction(options, k, vars);
            }
        });
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
    getAdminPage(path) {
        let pathArray = path.replace(/(^\/|\/$)/g, '').split('/');
        path = pathArray.join('/');
        if (this.adminPages[path])
            return new AdminPage(this.adminPages[path], this);
        for (let i = pathArray.length - 1; i > 0; i--) {
            pathArray[i] = '*';
            path = pathArray.join('/');
            if (this.adminPages[path])
                return new AdminPage(this.adminPages[path], this);
        }
    }
    // @todo: replace this with getEntityConfig
    getInstanceOptions(entityType, conf = { type: '' }) {
        return this.mergeConfigOptions((entityType.optionFields ? this.getConfigOptionsFromFields(entityType.optionFields || {}) : {}), entityType.options || {}, conf?.['options'] || {}, (typeof conf === 'string' ? {} : conf));
    }
    /**
     * Recursive helper function to get the descendant configuration from an entity object
     * @param entity An Entity object
     * @param options A list of options to retreive from the entity
     * @returns
     */
    _getEntityConfig(entity, options) {
        if (!entity)
            return {};
        return {
            ...this._getEntityConfig(entity._parent, options),
            ...Object.fromEntries(options.filter(k => entity?.hasOwnProperty(k)).map(k => ([k, entity?.[k]])))
        };
    }
    /**
     * Get the full config setting for a particular entity
     * @param type The Entity Type, e.g. 'field'
     * @param entity The ID of the particular entity to get
     * @param options The list of options and properties for the entity (so they aren't looked up more than once)
     * @returns ConfigSetting
     */
    getEntityConfig(type, id, parentOnly = false) {
        if (!type || !id)
            return {};
        let fields = this.getEntityConfigFields(type, id) || {};
        let options = Object.keys(fields);
        let entity = this.getEntity(type, id);
        return {
            ...this.getConfigOptionsFromFields(fields),
            ...this._getEntityConfig(parentOnly ? entity._parent : entity, options)
        };
    }
    /**
     * Get the list of configuration fields for a specific object
     * @param type The Entity Type, e.g. 'field'
     * @param id The ID of a specific entity
     * @returns An object whose values are ConfigFieldConfigSettings
     */
    getEntityConfigFields(type, id) {
        // Get the entity type
        if (!type.match(/s$/))
            type += 's';
        let entityType = this.getEntityType(type);
        if (!entityType)
            return;
        // Get the configuration fields for the entity type...
        let configFields = entityType.configFields || {};
        // ...add the "fields" configuration if necessary...
        if (entityType?.isFieldable && !type.match(/^fields?$/i))
            configFields.fields = {
                type: 'entityList',
                default: undefined,
                helptext: `The Fields for this ${entityType.label}`,
                widget: {
                    type: 'entityList',
                    options: {
                        entityType: 'field',
                    }
                }
            };
        // ...and get the root entity
        let entityRoot = this.getEntityRoot(type, id);
        // bail if there is no root entity
        if (!entityRoot)
            return configFields;
        // Check for a particular entity, and bail if there are no optionFields
        if (!entityRoot?.optionFields)
            return configFields;
        // Return the full set of fields.
        // TODO: decide whether optionFields should override configFields (powerful, but care needed) or vice versa (will not break things)
        // TODO: check that this adequately clones the fields, e.g. that optionFields.disabled:text doesn't overwrite configField.disabled for other fields, etc.
        return {
            ...configFields,
            ...entityRoot.optionFields,
        };
    }
    /**
     * Get the full Fieldgroup object for configuring an entity.
     * @param type The Entity Type
     * @param id The Entity ID (needed for option fields)
     * @returns Fieldgroup
     */
    getEntityConfigFieldgroup(type, id) {
        // Get the full field list, but clone the object since we will be setting defaults
        let fields = cloneDeep(this.getEntityConfigFields(type, id));
        if (!fields)
            return;
        // Get the list of options
        let options = Object.keys(fields);
        // Get the options from the parent element
        let defaults = this.getEntityConfig(type, id);
        // Set the defaults for optionFields
        options.forEach(k => { fields[k].default = defaults?.[k]; });
        // Return the new fieldgroup
        return new Fieldgroup({
            id: `entity_${type}`,
            fields // This has already been cloned
        }, this);
    }
    get defaultMediaStore() {
        let k = (Object.keys(this.mediaStores || {}))[0];
        if (!k)
            throw new Error('CMS has no mediaStores, but one is required by a field');
        return k;
    }
    get scriptFunctionHelp() {
        if (this._scriptFunctionHelp)
            return this._scriptFunctionHelp;
        this._scriptFunctionHelp = Object.keys(this.scriptFunctions)
            .sort()
            .map(id => {
            let fn = this.scriptFunctions[id];
            return {
                id,
                helptext: fn.helptext || '',
                params: Object.entries(fn.optionFields || {})
                    .map(([id, param]) => {
                    return {
                        id,
                        multiple: param.multiple,
                        helptext: param.helptext
                    };
                }),
            };
        });
        return this._scriptFunctionHelp;
    }
}
/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export function getConfigPathFromValuePath(path) {
    return 'fields.' + path.replace(/\[\d+\]/g, '').replace(/\./g, '.fields.');
}
