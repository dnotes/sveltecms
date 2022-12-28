import ImportContent from './ImportContent.svelte';
import { isBrowser, isWebWorker } from 'browser-or-node';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ContentType } from "../../core/ContentType";
import { get, isNull, set } from "lodash-es";
import SlugConfig from "../../core/Slug";
function getBasedir() { return (isBrowser || isWebWorker) ? '/' : import.meta.url.replace(/\/(?:node_modules|src)\/.+/, '').replace(/^file:\/\/\//, '/'); }
const plugin = {
    id: 'importContent',
    components: [
        {
            id: 'importContent',
            admin: true,
            component: ImportContent,
        }
    ],
    adminPages: [
        {
            id: 'import',
            label: 'Import',
            component: 'importContent',
            POST: async ({ cms, args, event, values }) => {
                // Get passed data
                let data = await event.request.json();
                let { contentTypeID: id, slugFields, indexedFields, dir, format, bodyField, createContentType, importContent } = data;
                if (!id || id === 'admin' || !id.match(/^[A-Za-z]+$/))
                    throw new Error(`Invalid Content Type ${id}`);
                let contentType = cms.contentTypes[id];
                let referenceFields = contentType
                    ? Object.keys(contentType.fields).filter(id => contentType.fields[id].type === 'reference').map(id => {
                        let displayKey = contentType.fields[id]?.widget?.options?.displayKey?.toString() || 'title';
                        return { id, displayKey, slugConfig: new SlugConfig(displayKey, cms) };
                    })
                    : data.referenceFields.split(/[\s,]+/).map(id => {
                        return { id, displayKey: 'title', slugConfig: new SlugConfig('title', cms) };
                    });
                // Create Content Type config
                let conf = {
                    id,
                    slug: slugFields,
                    fields: {},
                    contentStore: undefined,
                };
                // Get all files
                let basedir = getBasedir();
                let fullpath = path.resolve(basedir, dir);
                let filenames = fs.readdirSync(fullpath);
                let content = [];
                let errors = [];
                let filenameTest = new RegExp(`\\.${format.replace('ml', 'a?ml')}$`);
                filenames.forEach(f => {
                    if (!f.match(filenameTest))
                        return;
                    // Load the text of the files
                    let fulltext;
                    try {
                        fulltext = fs.readFileSync(`${fullpath}/${f}`, 'utf-8');
                    }
                    catch (e) {
                        errors.push(`${f}: Could not load (${e.message})`);
                        return;
                    }
                    // Parse the file text into Content
                    let item;
                    try {
                        if (format === 'json') {
                            item = JSON.parse(fulltext);
                        }
                        else if (format === 'md') {
                            let [, fm, body] = fulltext.split(/^---$/m);
                            item = { ...yaml.load(fm) };
                            item[bodyField] = body;
                        }
                        else if (format === 'yml') {
                            item = yaml.load(fulltext);
                        }
                    }
                    catch (e) {
                        errors.push(`${f}: Parsing error (${e.message})`);
                        return;
                    }
                    if (createContentType) {
                        // Build the fields for the Content Type, and get each piece of content
                        try {
                            Object.keys(item).forEach(k => {
                                conf.fields[k] = getFieldConfFromValue(item[k]) ?? conf.fields?.[k];
                            });
                        }
                        catch (e) {
                            errors.push(`${f}: Field error (${e.message})`);
                        }
                    }
                    content.push(item);
                });
                if (createContentType) {
                    indexedFields.split(/[\s,]+/).forEach(fieldID => {
                        if (get(conf.fields, fieldID))
                            set(conf.fields, `${fieldID}.index`, true);
                    });
                    referenceFields.forEach(rf => {
                        if (get(conf.fields, rf.id)) {
                            set(conf.fields, `${rf.id}.type`, 'reference');
                            set(conf.fields, `${rf.id}.widget`, {
                                type: 'reference',
                                contentTypes: rf.id,
                                freeTagging: true,
                                referenceKey: 'referencedContent',
                            });
                            set(conf.fields, `${rf.id}.multiple`, true);
                        }
                    });
                    cms.contentTypes[id] = new ContentType(id, conf, cms);
                }
                if (importContent) {
                    for (let i = 0; i < content.length; i++) {
                        let item = content[i];
                        referenceFields.forEach(rf => {
                            let value = get(item, rf.id);
                            if (Array.isArray(value))
                                set(item, rf.id, value.map(v => {
                                    return (v?.constructor === Object)
                                        ? {
                                            // @ts-ignore I thought I just established that v is an Object?
                                            ...v,
                                            _type: rf.id.replace(/.+\./, ''),
                                            _slug: cms.getSlug(v, rf.slugConfig, false),
                                        }
                                        : {
                                            _type: rf.id.replace(/.+\./, ''),
                                            _slug: cms.getSlug({ title: v }, rf.slugConfig, false),
                                            [rf.displayKey]: v
                                        };
                                }));
                        });
                        // @ts-ignore TODO: fix types so if you save a single piece of content, it returns a single piece of content
                        content[i] = await cms.saveContent(id, item);
                    }
                }
                if (createContentType)
                    cms.conf.contentTypes[id] = conf;
                await cms.saveContent(cms.admin, cms.conf, { filepath: cms.conf.configPath, skipIndex: true });
                return { conf, content, errors };
            }
        },
    ]
};
function getFieldConfFromValue(value, conf = undefined) {
    let type = conf ? conf.type : undefined;
    // @ts-ignore this works, why is it an error?
    let newConf = { ...conf, type };
    let v = Array.isArray(value) ? value[0] : value;
    let newType = parseValueType(v, type);
    if (!newType)
        return; // ...nothing in this field; no changes, do not save
    newConf.type = newType;
    if (newType === 'fieldgroup') {
        if (!newConf.fields)
            newConf.fields = {};
        Object.keys(v).forEach(k => {
            newConf.fields[k] = getFieldConfFromValue(v[k], newConf.fields[k]);
        });
    }
    if (Array.isArray(value)) {
        if (conf && !newConf.multiple)
            newConf.multipleOrSingle = true;
        // If the conf was single, it can be multiple or single
        newConf.multiple = true;
        // It's definitely multiple
    }
    else {
        if (newConf.multiple)
            newConf.multipleOrSingle = true;
        // If the conf was multiple, it can be multiple or single
    }
    return newConf;
}
function parseValueType(v, type = undefined) {
    // For null values, return the existing type
    if (isNull(v) || v === undefined)
        return type;
    // Check if the field is a fieldset
    if (v?.constructor === Object) {
        if (type && (type !== 'fieldgroup'))
            throw new Error(`non-fieldgroup value in fieldgroup field`);
        return 'fieldgroup';
    }
    else if (type === 'fieldgroup')
        throw new Error(`fieldgroup value in non-fieldgroup field`);
    // See if the field should be markdown or text
    if (typeof v === 'string') {
        if (v.length > 255)
            return 'markdown';
        return type === 'markdown' ? 'markdown' : 'text';
    }
    // If the field is already text, then it stays text
    if (type === 'text')
        return 'text';
    // Boolean
    if (typeof v === 'boolean')
        return 'boolean';
    // Numbers
    if (typeof v === 'number') {
        if (v.toString().includes('.'))
            return 'float';
        return 'number';
    }
    // Dates
    if (v instanceof Date)
        return 'date';
    throw new Error(`could not determine field type`);
}
export default plugin;
