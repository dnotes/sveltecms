import { get } from 'lodash-es';
function extname(path) { return path.replace(/^.+\//, '').replace(/^[^\.].*\./, '').replace(/^\..+/, ''); }
function isBrowser() { return typeof window !== 'undefined'; }
function getBasedir() { return isBrowser() ? '' : import.meta.url; }
async function getFs(dbName) {
    if (isBrowser()) {
        const FS = await import('@isomorphic-git/lightning-fs');
        const fs = new FS(dbName);
        return fs;
    }
    const fs = await import('fs');
    return fs;
}
export const fileStoresContentOptionFields = {
    databaseName: {
        type: 'text',
        default: '',
        tooltip: 'The name used for saving files in-browser. This is required if you are using the browser-based filesystem. ' +
            'It should be globally unique and generally should be the same across one site or app; your site url might be a good choice. ' +
            'At the moment, if you are using something like isomorphic-git, you must import content into the browser filesystem yourself.',
    },
    contentDirectory: {
        type: 'text',
        default: 'content',
        tooltip: 'The directory for local content files relative to the project root',
    },
    prependContentTypeIdAs: {
        type: 'text',
        widget: 'select',
        widgetOptions: {
            options: {
                '': 'None',
                'directory': 'Directory',
                'filename': 'Filename prefix'
            },
        },
        default: 'directory',
        tooltip: 'Include the content type id as part of the path',
    },
    fileExtension: {
        type: 'text',
        widget: 'select',
        default: 'md',
        required: true,
        widgetOptions: {
            options: {
                'md': '.md (Markdown)',
                'json': '.json (JSON)',
                'yml': '.yml (YAML)',
                'yaml': '.yaml (YAML)',
            }
        },
        tooltip: 'What type of file to use for new content; must be one of "md", "json", "yml", or "yaml"',
    },
    markdownBodyField: {
        type: 'text',
        default: 'body',
        tooltip: 'Which field should be used as the body of the Markdown file',
    },
};
async function collapseFormItem(cms, contentType, fields, data, prefix) {
    let promises = Object.entries(fields).map(async ([id, field]) => {
        let formPath = [prefix, id].filter(Boolean).join('.');
        let item = get(data, formPath);
        let value;
        let itemIsArray = Object.keys(value).reduce((cur, v) => {
            if (cur === false)
                return cur;
            return (typeof cur === 'number' && v == cur.toString()) ? cur + 1 : false;
        }, 0);
        // Collection fields must be collapsed recursively
        if (field.type === 'collection') {
            if (field.multiple && itemIsArray) {
                let promises = Object.entries(item).map(async ([i, item]) => {
                    return collapseFormItem(cms, contentType, field.fields, item, formPath);
                });
                value = await Promise.all(promises);
            }
            else {
                value = await collapseFormItem(cms, contentType, field.fields, item['0'], formPath);
            }
        }
        // multiple fields must either handle multiple values or be an array - otherwise it's definitely an error
        else if (field.multiple && !itemIsArray && !(field.widget.handlesMultiple && field.widget.formDataHandler)) {
            throw new Error(`Multiple field must either be an array or use a widget with handlesMultiple and formDataHandler: ${formPath}.`);
        }
        // if it is a valid multiple field
        else if (field.multiple || field.widget.handlesMultiple) {
            // Make the item an array if necessary
            value = itemIsArray ? Object.entries(item).map(([i, val]) => val) : item;
            // Use a formDataHandler if provided
            if (field.widget.formDataHandler) {
                if (field.widget.handlesMultiple) {
                    value = await field.widget.formDataHandler(value, cms, contentType, field);
                }
                else {
                    let promises = Object.entries(item).map(async ([i, item]) => {
                        return field.widget.formDataHandler(item, cms, contentType, field);
                    });
                    value = await Promise.all(promises);
                }
            }
            // For singular fields that use a widget with handlesMultiple, return the first value
            if (!field.multiple && Array.isArray(value))
                value = value[0];
        }
        else {
            value = item['0'];
        }
        return [id, value];
    });
    return Object.fromEntries(await Promise.all(promises));
}
/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export async function formDataHandler(cms, contentTypeID, formdata) {
    let rawdata = {};
    // @ts-ignore -- why does this not have a proper FormData object?!?!!
    for (let k of formdata.keys()) {
        rawdata[k] = formdata.getAll(k);
    }
    const contentType = cms.getContentType(contentTypeID);
    return collapseFormItem(cms, contentType, contentType.fields, rawdata);
}
export async function saveContentEndpoint(cms, contentTypeID, request, options = {}) {
    let formdata = await request.formData();
    let data = await formDataHandler(cms, contentTypeID, formdata);
    try {
        let response = await cms.saveContent(contentTypeID, data, options);
        return response;
    }
    catch (error) {
        return {
            status: 500,
            error,
            data,
        };
    }
}
export async function deleteContentEndpoint(cms, contentTypeID, request, options = {}) {
    let formdata = await request.formData();
    let data = await formDataHandler(cms, contentTypeID, formdata);
    try {
        let response = await cms.deleteContent(contentTypeID, data, options);
        return response;
    }
    catch (error) {
        return {
            status: 500,
            error,
            data,
        };
    }
}
export async function parseFileStoreContentItem(_filepath, content, opts) {
    let ext = extname(_filepath);
    if (ext === '.json')
        return { ...JSON.parse(content), _filepath };
    else {
        const yaml = await import('js-yaml');
        if (ext === 'yml' || ext === 'yaml')
            return { ...yaml.load(content), _filepath, };
        else if (ext === 'md') {
            let sections = content.split(/^---$/g);
            if (sections.length > 2 && sections.shift() === '') {
                let data;
                try {
                    let data = yaml.load(sections.shift());
                }
                catch (e) { } // The yaml would not load.
                if (data)
                    return { ...data, _filepath };
                else
                    return { [opts.markdownBodyField]: content, _filepath };
            }
        }
        throw new Error('Extension for file stores must be md, json, yml or yaml.');
    }
}
const plugin = {
    contentStores: [
        {
            id: 'staticFiles',
            optionFields: fileStoresContentOptionFields,
            listContent: async (contentType, opts) => {
                const fs = await getFs(opts.databaseName);
                let glob = opts.glob ? `${getBasedir()}/${opts.glob}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `*.(${opts.fileExtension})`; // file extensions
                glob = glob.replace(/\/+/g, '/');
                const fg = await import('fast-glob');
                return fg.sync(glob, { fs }).map(f => {
                    let item = fs.readFileSync(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
            },
            getContent: async (contentType, opts, slug = '') => {
                const fs = await getFs(opts.databaseName);
                let glob = opts.glob ? `${getBasedir()}/${opts.glob}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `*.(${opts.fileExtension})`; // file extensions
                glob = glob.replace(/\/+/g, '/');
                const fg = await import('fast-glob');
                let files = fg.sync(glob, { fs }).map(f => {
                    let item = fs.readFileSync(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
                return files.length === 1 ? files[0] : files;
            },
            saveContent: async (content, contentType, opts) => {
                let slug = opts.slug ?? content._slug ?? content.slug;
                if (!slug)
                    throw new Error(`Content to be saved must have a slug: ${contentType.label}`);
                const fs = await getFs(opts.databaseName);
                const base = `${getBasedir()}/${opts.contentDirectory}/`;
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `${slug}.${opts.fileExtension}`; // file extensions
                let body = '';
                switch (opts.fileExtension) {
                    case "json":
                        content = JSON.stringify(content, null, 2);
                        break;
                    case "md":
                        body = content[opts.markdownBodyField] || '';
                        delete (content[opts.markdownBodyField]);
                    case "yml":
                    case "yaml":
                        let yaml = await import('js-yaml');
                        content = yaml.dump(content);
                        if (opts.fileExtension === 'md')
                            content = `---\n${content}\n---\n${body}`;
                        break;
                    default:
                        throw new Error('Extension for file stores must be md, json, yml or yaml.');
                }
                fs.writeFileSync(filepath, content);
            },
            deleteContent: async (content, contentType, opts) => {
                let slug = opts.slug ?? content._slug ?? content.slug;
                if (!slug)
                    throw new Error(`Content to be deleted must have a slug: ${contentType.label}`);
                const fs = await getFs(opts.databaseName);
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `${slug}.${opts.fileExtension}`; // file extensions
                fs.unlinkSync(filepath);
            },
        }
    ],
    mediaStores: [
        {
            id: 'local',
            saveMedia: async (file, opts) => {
                return '';
            },
            deleteMedia: async (file, opts) => {
                return '';
            },
        }
    ],
};
export default plugin;
