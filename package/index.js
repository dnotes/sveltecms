import { AdminPage, templateAdminPage } from './core/AdminPage';
import { Field, templateField, fieldTypes } from './core/Field';
import { widgetTypes, templateWidget } from './core/Widget';
import { ContentType, templateContentType } from "./core/ContentType";
import { templateMediaStore } from './core/MediaStore';
import { templateContentStore } from './core/ContentStore';
import { Fieldgroup, templateFieldgroup } from './core/Fieldgroup';
import { transformers, templateTransformer } from './core/Transformer';
import { ScriptFunction, scriptFunctions, parseScript, templateScriptFunction } from './core/ScriptFunction';
import { templateComponent } from './core/Component';
import { displayComponents, templateDisplay, defaultDisplayModes, isDisplayConfig } from './core/Display';
import staticFilesPlugin from './plugins/staticFiles';
import { cloneDeep, mergeWith, get as getProp, union, sortBy, isEqual, merge, uniq } from 'lodash-es';
import SlugConfig, { templateSlug } from './core/Slug';
import { Indexer, templateIndexer } from './core/Indexer';
import { hooks, templateHook } from './core/Hook';
import { templatePlugin } from './core/Plugin';
import { mergeCmsConfig } from './utils';
const customComponents = import.meta.glob('/src/cms/*.svelte');
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
    'lists',
    'indexers',
    'contentStores',
    'mediaStores',
    'fields',
    'widgets',
    'fieldgroups',
    'transformers'
];
export default class SvelteCMS {
    constructor(conf, plugins = []) {
        this.conf = {
            configPath: '',
            displays: {},
            settings: {},
            contentTypes: {},
            lists: {},
            contentStores: {},
            mediaStores: {},
            fields: {},
            widgets: {},
            fieldgroups: {},
            transformers: {},
            components: {},
            plugins: {},
        };
        this.defaultConf = {
            displays: {
                contentType: {
                    default: 'div',
                    page: 'div',
                    teaser: 'div',
                    reference: 'span',
                },
                field: {
                    default: 'div',
                    page: 'div',
                    teaser: 'div',
                    reference: 'none',
                },
                fieldgroup: {
                    default: 'div',
                    page: 'div',
                    teaser: 'div',
                    reference: 'none',
                },
            },
            fields: {
                title: {
                    type: 'text',
                    index: true,
                    required: true,
                    displays: {
                        default: {
                            type: 'h2',
                            link: true,
                        },
                        reference: {
                            type: 'span',
                            link: true,
                        },
                        page: 'h1'
                    }
                },
            }
        };
        this.entityTypes = {
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
        this.indexers = {};
        this.contentTypes = {};
        this.lists = {};
        this.plugins = {};
        this.hooks = {
            contentPreSave: [],
            contentPreDelete: [],
            contentPostWrite: [],
        };
        this.use(staticFilesPlugin);
        displayComponents.forEach(c => {
            this.components[c.id] = c;
        });
        plugins.forEach(p => this.use(p));
        mergeWith(this.conf, this.defaultConf, conf, mergeCmsConfig);
        this.displays = Object.fromEntries(Object.entries(this.conf.displays).map(([entityTypeID, displays]) => {
            let fullDisplay = { ...{ default: 'div', page: 'div', teaser: 'div', reference: (entityTypeID === 'contentType' ? 'span' : 'none') }, ...displays };
            return [entityTypeID, fullDisplay];
        }));
        Object.keys(customComponents).forEach(filepath => {
            let id = filepath.replace('/src/cms/', '').replace(/\.svelte$/i, '');
            this.components[id] = {
                id,
                component: customComponents[filepath]().then(c => c?.['default']),
            };
        });
        // Build out config for the lists
        // This must happen before the content types and fields are built, as fields may have values in $lists
        Object.entries(this?.conf?.lists || []).forEach(([key, list]) => {
            if (typeof list === 'string')
                this.lists[key] = list.split(splitter);
            else
                this.lists[key] = list;
        });
        // Initialize all of the stores, widgets, and transformers specified in config
        ['contentStores', 'mediaStores', 'transformers', 'components', 'fieldgroups', 'indexers'].forEach(objectType => {
            if (this?.conf?.[objectType]) {
                Object.entries(this.conf[objectType]).forEach(([id, settings]) => {
                    // config can:
                    // - create a new item (`conf.widgetTypes.newItem = ...`)
                    // - modify an existing item (`conf.widgetTypes.text = ...`)
                    // - create a new item based on an existing item (`conf.widgetTypes.longtext = { type:"text", ... })
                    const type = this.conf[objectType][id].type || this.conf[objectType][id].id || id;
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
            if (this?.conf?.[objectType]) {
                let typesKey = objectType.replace('s', 'Types');
                Object.entries(this.conf[objectType]).forEach(([id, item]) => {
                    item = typeof item === 'string' ? { type: item } : item;
                    let type = item['type'];
                    if (!type || typeof type !== 'string')
                        throw new Error(`Type is required for ${objectType}.${id} (received ${JSON.stringify(type)})`);
                    let _parent = this.getEntity(objectType, type);
                    if (!_parent)
                        throw new Error(`Parent not found for ${objectType}.${id}. Is "${id}" a typo? Did you define ${objectType}.${id} before ${objectType}.${item?.['type'] ?? item}?`);
                    // @ts-ignore This has been type checked by now
                    this[objectType][id] = { ...item, _parent };
                });
            }
        });
        // Build out config for the content types
        Object.entries(this.conf?.contentTypes || {}).forEach(([id, conf]) => {
            this.contentTypes[id] = new ContentType(id, conf, this);
        });
        // @ts-ignore
        this.defaultContentType = new ContentType('default', {
            id: 'default',
            contentStore: '',
            displays: this.displays.contentType,
            fields: Object.fromEntries(this.listEntities('field').map(id => {
                return [id, this.fields[id] || id];
            }))
        }, this);
        let adminStore = this?.conf?.adminStore || this?.conf?.configPath || 'src/lib/sveltecms.config.json';
        if (typeof adminStore === 'string' && !this.contentStores[adminStore]) {
            let contentDirectory = adminStore.replace(/\/[^\/]+$/, '');
            let fileExtension = adminStore.replace(/.+[\.]/, '');
            if (!['json', 'yml', 'yaml'].includes(fileExtension))
                throw new Error('adminStore must end in .json, .yml, or .yaml.');
            adminStore = {
                type: 'staticFiles',
                options: {
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
                ...Object.fromEntries(Object.keys(this.conf).map(k => [k, 'fieldgroup'])),
                configPath: 'text',
            }
        }, this);
        hooks.forEach(hook => {
            // @ts-ignore These will be correct.
            this.hooks[hook.type].push(hook);
        });
        Object.keys(this.hooks).forEach(k => {
            this.hooks[k] = sortBy(this.hooks[k], ['weight', 'label']);
        });
        this.indexer = new Indexer('default', this?.conf?.settings?.indexer ?? 'staticFiles', this);
    }
    use(plugin, config) {
        // TODO: allow CMSPluginBuilder function, in case people pass the function instead of the plugin
        this.plugins[plugin.id] = plugin;
        if (plugin.conf)
            mergeWith(this.defaultConf, plugin.conf, mergeCmsConfig);
        ['fieldTypes', 'widgetTypes', 'transformers', 'contentStores', 'mediaStores', 'lists', 'adminPages', 'components', 'fieldgroups', 'indexers', 'scriptFunctions'].forEach(k => {
            try {
                plugin?.[k]?.forEach(conf => {
                    if (conf)
                        this[k][conf.id] = conf;
                });
            }
            catch (e) {
                e.message = `Plugin ${plugin.id} failed loading ${k}\n${e.message}`;
                throw e;
            }
        });
        // @ts-ignore How would we do this? If there is a bad implementation, that is the fault of the plugin...
        if (plugin.hooks)
            plugin.hooks.forEach(hook => { this.hooks?.[hook.type]?.push(hook); });
        // This allows plugins to update existing widgets to work with provided fields. See markdown plugin.
        Object.entries(plugin?.fieldWidgets || {}).forEach(([fieldTypeID, widgetTypeIDs]) => {
            widgetTypeIDs.forEach(id => { if (!this.widgetTypes[id].fieldTypes.includes(fieldTypeID))
                this.widgetTypes[id].fieldTypes.push(fieldTypeID); });
        });
    }
    preMount(fieldableEntity, values) {
        let res = {}; // variable for result
        Object.entries(fieldableEntity?.fields || {}).forEach(([id, field]) => {
            if (values.hasOwnProperty(id)) {
                try {
                    // For references, fieldgroups, or other fieldable field types (e.g. possibly image)
                    if ((field.type === 'reference' || field.type === 'fieldgroup' || field?.fields) && values?.[id] && typeof values?.[id] !== 'string') {
                        if (Array.isArray(values[id])) {
                            res[id] = [];
                            for (let i = 0; i < values[id]['length']; i++) {
                                // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
                                let container = field.type === 'reference'
                                    ? (this.contentTypes[values[id][i]?.['_type']] || this.defaultContentType)
                                    : (values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field);
                                res[id][i] = this.preMount(container, values[id][i]);
                            }
                        }
                        else {
                            let container = field.type === 'reference'
                                ? (this.contentTypes[values[id]?.['_type']] || this.defaultContentType)
                                : values[id]?.['_fieldgroup'] ? new Fieldgroup(values[id]?.['_fieldgroup'], this) : field;
                            // @ts-ignore the typecheck above should be sufficient
                            res[id] = container?.fields ? this.preMount(container, values?.[id]) : values[id];
                        }
                    }
                    else
                        res[id] = this.doFieldTransforms('preMount', field, this.doFieldTransforms('preSave', field, values?.[id]));
                }
                catch (e) {
                    e.message = `value: ${JSON.stringify(values[id], null, 2)}\npreMount/${field.id} : ${e.message}`;
                    throw e;
                }
            }
        });
        // Pass on CMS-specific items like _slug (beginning with _)
        Object.keys(values).filter(k => k.match(/^_/)).forEach(k => res[k] = values[k]);
        return res;
    }
    preSave(fieldableEntity, values) {
        let res = {};
        Object.entries(fieldableEntity?.fields || {}).forEach(([id, field]) => {
            if (values.hasOwnProperty(id)) {
                try {
                    // For references and fieldgroups (as above)
                    if ((field.type === 'reference' || field.type === 'fieldgroup' || field?.fields) && values?.[id] && typeof values?.[id] !== 'string') {
                        res[id] = [];
                        if (Array.isArray(values[id])) {
                            for (let i = 0; i < values[id]['length']; i++) {
                                // find the actual fields, in case it is a fieldgroup that can be selected on the widget during editing
                                let container = field.type === 'reference'
                                    ? (this.contentTypes[values[id][i]?.['_type']] || this.defaultContentType)
                                    : values[id][i]._fieldgroup ? new Fieldgroup(values[id][i]._fieldgroup, this) : field;
                                res[id][i] = this.preSave(container, values[id][i]);
                            }
                        }
                        else {
                            let container = field.type === 'reference'
                                ? (this.contentTypes[values[id]?.['_type']] || this.defaultContentType)
                                : values[id]['_fieldgroup'] ? new Fieldgroup(values[id]['_fieldgroup'], this) : field;
                            // Any "fieldgroup" fields in content can be static (with "fields" prop) or dynamic, chosen by content editor
                            // We get the new Fieldgroup for the latter case, and either way the container will have "fields" prop.
                            // When saving config, the "fieldgroup" fields will not have a "fields" prop, and must still be saved.
                            // @TODO: Evaluate this for security, and probably fix it, since at the moment it will try to save
                            // almost any value to the configuration, albeit serialized.
                            // @ts-ignore the typecheck above should be sufficient
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
        let typeSingular = type.replace(/s$/, '');
        let typePlural = `${typeSingular}s`;
        if (typePlural === 'fields') {
            if (entityID)
                return Object.keys(this.getContentType(entityID)?.fields || {});
            return this.getFieldTypes(includeAdmin);
        }
        else if (typePlural === 'widgets') {
            return this.getFieldTypeWidgets(includeAdmin, entityID);
        }
        else if (['widgetType', 'fieldType', ...Object.keys(this.entityTypes)].includes(typeSingular)) {
            return Object.keys(this[typePlural] ?? {}).filter(k => (includeAdmin || !this[typePlural][k]?.['admin']));
        }
        return Object.keys(this.entityTypes);
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
        if (!type.match(/s$/))
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
    getContentType(contentType) {
        if (!this.contentTypes[contentType])
            throw new Error(`Content type not found: ${contentType}`);
        return this.contentTypes[contentType];
    }
    getContentStore(contentType) {
        const type = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        return type.contentStore;
    }
    getUrl(item, contentTypeID) {
        if (!contentTypeID)
            contentTypeID = item._type;
        if (contentTypeID === this?.conf?.settings?.rootContentType)
            contentTypeID = '';
        let slug = item._slug;
        if (!contentTypeID && slug === this?.conf?.settings?.frontPageSlug)
            slug = '';
        return '/' + [contentTypeID, slug].filter(Boolean).join('/');
    }
    slugifyContent(content, contentType, force) {
        if (Array.isArray(content)) {
            content.forEach(c => {
                c._slug = this.getSlug(c, contentType.slug, force);
                c._type = contentType.id;
            });
        }
        else {
            content._slug = this.getSlug(content, contentType.slug, force);
            content._type = contentType.id;
        }
        return content;
    }
    getSlug(content, slug, force) {
        if (content._slug && !force)
            return content._slug;
        return slug.fields
            .map(id => getProp(content, id))
            .filter(value => typeof value !== 'undefined')
            .map(value => this.transform(value, slug.slugify))
            .join(slug.separator);
    }
    async listContent(contentTypes, options = {}) {
        // Ensure proper types for options and contentTypes
        let opts = typeof options === 'string' ? { searchText: options } : options;
        if (!Array.isArray(contentTypes))
            contentTypes = [contentTypes];
        contentTypes = contentTypes.map(t => typeof t === 'string' ? this.contentTypes[t] ?? t : t);
        // Get raw content
        let contentLists = await Promise.all(contentTypes.map(async (contentType) => {
            let rawContent;
            // Usually we will get items from the Indexer, unless a full content search is desired
            // AND we are sure we are dealing with a real content type (we may not be, with reference fields)
            if (!opts?.['skipIndex'] || typeof contentType === 'string') {
                // @ts-ignore these are typechecked above
                rawContent = await this.indexer.searchContent(contentType, opts.searchText, opts);
            }
            else {
                const db = this.getContentStore(contentType);
                rawContent = await db.listContent(contentType, { ...db.options, ...opts });
            }
            if (!rawContent || !rawContent.length)
                return [];
            // For referene fields, we may not be dealing with a full content type.
            // At the moment we just return the IndexItem.
            // TODO: Evaluate for security and usability:
            // - Are there cases where passing a free-tagged IndexItem to Display will be insecure?
            // - Can/Should we add a phantom Content Type to Indexer or CMS, so that we can preMount?
            if (typeof contentType === 'string')
                return rawContent;
            this.slugifyContent(rawContent, contentType);
            if (opts['getRaw'])
                return rawContent;
            return Array.isArray(rawContent) ? rawContent.map(c => this.preMount(contentType, c)) : [this.preMount(contentType, rawContent)];
        }));
        // Unify content arrays
        return [].concat(...contentLists);
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
        // For content references, we may need to get an item that is not actually a content type.
        if (typeof contentType === 'string' && !this.contentTypes[contentType]) {
            let index = await this.indexer.getIndex(contentType);
            return index.find(item => item._slug === slug) || undefined;
        }
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        let rawContent = await db.getContent(contentType, { ...db.options, ...options }, slug);
        // For content references, it may happen that some items are stored only in the index file
        if (!rawContent || (Array.isArray(rawContent) && !rawContent.length)) {
            rawContent = (await this.indexer.getIndex(contentType.id)).find(item => item?._slug === slug);
        }
        // If there's really no content, just return.
        if (!rawContent || isEqual(rawContent, []))
            return;
        if (Array.isArray(rawContent))
            rawContent = rawContent.find(item => item?._slug === slug) || rawContent[0];
        this.slugifyContent(rawContent, contentType);
        if (options.getRaw)
            return rawContent;
        return this.preMount(contentType, rawContent);
    }
    async saveContent(contentType, content, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        let items = Array.isArray(content) ? content : [content];
        for (let i = 0; i < items.length; i++) {
            // Set up old Content for contentPostWrite hooks
            let before;
            if (contentType === this.admin)
                before = cloneDeep(this.conf);
            else if (items[i]._oldSlug && !options.skipHooks) {
                before = await db.getContent(contentType, { ...db.options, options }, items[i]._oldSlug);
                before = this.slugifyContent(this.preSave(contentType, before), contentType);
            }
            // Get the new Content for the contentPreWrite hooks
            // @ts-ignore this should already be type safe
            items[i] = this.slugifyContent(this.preSave(contentType, items[i]), contentType);
            // When a slug is changing, don't allow the change if it would overwrite content
            if (items[i]._oldSlug &&
                items[i]._slug !== items[i]._oldSlug &&
                (await this.listContent(contentType)).find(item => item._slug === items[i]._slug))
                throw new Error(`Tried to overwrite content: ${contentType.id}/${items[i]._slug}`);
            // Run contentPreWrite hooks, and bail if there is an error
            try {
                if (!options.skipHooks)
                    await this.runHook('contentPreSave', items[i], contentType, this, { ...db.options, ...options });
            }
            catch (e) {
                e.message = `Error saving content ${items[i]._type}/${items[i]._slug}:\n${e.message}`;
                throw e;
            }
            items[i] = await db.saveContent(items[i], contentType, { ...db.options, ...options });
            // When a slug is changing, delete the old content
            if (items[i]._oldSlug && items[i]._slug !== items[i]._oldSlug)
                await this.deleteContent(contentType, before, { newSlug: items[i]._slug });
            try {
                if (!options.skipHooks)
                    await this.runHook('contentPostWrite', { before, after: items[i], contentType }, this, { ...db.options, ...options });
            }
            catch (e) {
                console.log(e.message.split('\r'));
                items[i]._errors = e.message.split('\r');
            }
        }
        if (!options.skipIndex)
            await this.indexer.saveContent(contentType, items.map(i => this.getIndexItem(i)));
        return Array.isArray(content) ? items : items[0];
    }
    async deleteContent(contentType, content, options = {}) {
        contentType = typeof contentType === 'string' ? this.getContentType(contentType) : contentType;
        const db = this.getContentStore(contentType);
        let items = Array.isArray(content) ? content : [content];
        for (let i = 0; i < items.length; i++) {
            // Get the content to be deleted, for preDelete hooks
            // @ts-ignore slugifyContent returns singular if passed singular
            items[i] = this.slugifyContent(this.preSave(contentType, items[i]), contentType);
            // Run contentPreWrite hooks, and bail if there is an error
            try {
                if (!options.skipHooks)
                    await this.runHook('contentPreDelete', items[i], contentType, this, { ...db.options, ...options });
            }
            catch (e) {
                e.message = `Error deleting content ${items[i]._type}/${items[i]._slug}:\n${e.message}`;
                throw e;
            }
            items[i] = await db.deleteContent(items[i], contentType, { ...db.options, ...options });
            try {
                if (!options.skipHooks)
                    await this.runHook('contentPostWrite', { before: items[i], contentType }, this, { ...db.options, ...options });
            }
            catch (e) {
                console.log(e.message.split('\r'));
                items[i]._errors = e.message.split('\r');
            }
        }
        if (!options.skipIndex)
            await this.indexer.deleteContent(contentType, items.map(i => this.getIndexItem(i)));
        return Array.isArray(content) ? items : items[0];
    }
    newContent(contentTypeID, values = {}) {
        if (!this.contentTypes[contentTypeID])
            return;
        // Here we start the process of obtaining a new piece of content.
        // To do this, we have to initialize the fields as Widgets, because
        // they may have Script Functions determining their default values.
        let contentType = this.getWidgetFields(this.contentTypes[contentTypeID], { values, errors: {}, touched: {} });
        function getDefaults(entity, prefix = '') {
            return Object.fromEntries(Object.entries(entity.fields)
                .map(([id, field]) => {
                let fieldPath = [prefix, id].filter(Boolean).join('.');
                if (!field.isFieldable)
                    return [id, getProp(field.values, fieldPath) ?? field.default];
                let fieldgroup = this.getWidgetFields(field);
                return getDefaults(fieldgroup, fieldPath);
            }));
        }
        let content = getDefaults(contentType);
        // @ts-ignore slugifyContent returns a single object if passed a single object
        return this.slugifyContent(content, this.contentTypes[contentTypeID]);
    }
    getIndexItem(content) {
        if (!content)
            return;
        let contentType = this.contentTypes[content?._type] || this.defaultContentType;
        // For IndexItem, only use _slug and _type fields (TODO: evaluate)
        let item = { _slug: content._slug, _type: content._type };
        // Also index all fields in the list of indexFields
        contentType.indexFields.forEach(k => { item[k] = getProp(content, k); });
        return item;
    }
    async runHook(type, ...args) {
        let hooks = this.hooks[type] ?? [];
        for (let i = 0; i < hooks.length; i++) {
            await hooks[i].fn(...args);
        }
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
            this.initializeContentField(c.fields[id], { ...vars, id, cms: this });
            // @ts-ignore
            c.fields[id].events?.forEach(e => c.eventListeners.push(e));
        });
        // @ts-ignore
        return c;
    }
    findFields(fields, query, prefix = '') {
        let foundFields = [];
        Object.entries(fields).forEach(([id, field]) => {
            let newID = [prefix, id].filter(Boolean).join('.');
            let matchingFields = field.fields ? this.findFields(field.fields, query, newID) : [];
            foundFields.push(...matchingFields);
            if (query instanceof Function) {
                if (query(field))
                    foundFields.push(newID);
            }
            else if (!Object.entries(query).reduce((skip, [prop, value]) => {
                return skip || !isEqual(getProp(field, prop), value);
            }, false))
                foundFields.push(newID);
        });
        return foundFields;
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
                function: new ScriptFunction(e.function, { ...vars, field })
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
        let func = new ScriptFunction(conf, vars);
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
            options[k] = parseScript(options[k]) ?? options[k];
            if (options[k]?.function && typeof options[k]?.function === 'string') {
                this.initializeFunction(options, k, vars);
            }
            else if (Array.isArray(options[k])) {
                for (let i = 0; i < options[k].length; i++) {
                    if (options[k][i]?.function && typeof options[k][i].function === 'string') {
                        this.initializeFunction(options[k], i.toString(), vars);
                    }
                }
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
     * @param id The ID of the particular entity to get
     * @param parentOnly If true, the config for the current entity will be ignored
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
        // // ...add the "display" configuration if necessary...
        // if (entityType?.isDisplayable) configFields.displays = {
        //   type: 'entityList',
        //   default: undefined,
        //   helptext: `The Display configuration for this ${entityType.label}.`,
        //   widget: {
        //     type: 'entityList',
        //     options: {
        //       entityType: 'display',
        //     }
        //   }
        // }
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
                helptext: fn.description || '',
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
    /**
     * @TODO: allow adding displayModes, either with config or plugins
     */
    get displayModes() {
        return defaultDisplayModes;
    }
    /**
     *
     * @param entityTypeID The ID of a Displayable Entity Type, e.g. "contentType", "field", or "fieldgroup"
     * @param entity A Displayable Entity, e.g. a ContentType, Field, or Fieldgroup
     * @param displayMode A displayMode, e.g. "default", "page", "teaser", "reference", or a custom displayMode
     * @returns FullEntityDisplayConfig
     */
    getFullEntityDisplayConfig(entityTypeID, entity) {
        return {
            default: this.getEntityDisplayConfig(entityTypeID, entity, 'default'),
            page: this.getEntityDisplayConfig(entityTypeID, entity, 'page'),
            teaser: this.getEntityDisplayConfig(entityTypeID, entity, 'teaser'),
            reference: this.getEntityDisplayConfig(entityTypeID, entity, 'reference'),
            // @TODO: add custom display modes
        };
    }
    /**
     *
     * @param entityTypeID The ID of a Displayable Entity Type, e.g. "contentType", "field", or "fieldgroup"
     * @param entity A Displayable Entity, e.g. a ContentType, Field, or Fieldgroup
     * @param displayMode A displayMode, e.g. "default", "page", "teaser", "reference", or a custom displayMode
     * @returns
     */
    getEntityDisplayConfig(entityTypeID, entity, displayMode) {
        if (!entity)
            return this.displays?.[entityTypeID]?.[displayMode] ?? this.displays?.[entityTypeID]?.default;
        if (entity?.['displays']?.[displayMode] || entity?.['displays']?.[displayMode] === false)
            return entity['displays'][displayMode];
        if (entity?.['displays']?.default || entity?.['displays']?.default === false)
            return entity['displays'].default;
        if (typeof entity?.['displays'] === 'string')
            return entity['displays'];
        return this.getEntityDisplayConfig(entityTypeID, entity?.['_parent'], displayMode);
    }
}
/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export function getConfigPathFromValuePath(path) {
    return 'fields.' + path.replace(/\[\d+\]/g, '').replace(/\./g, '.fields.');
}
