import fs from 'fs';
import path from 'path';
export const fileStoresContentOptionFields = {
    directory: {
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
    saveAsExtension: {
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
    listExtensions: {
        type: 'tags',
        default: ['md'],
        tooltip: 'Extensions to include when getting content',
    },
};
export async function parseFormData(cms, contentType, formData) {
}
export async function saveContentEndpoint(cms, contentType, event) {
    let req = event.request;
}
export async function deleteContentEndpoint(cms, contentType, event) {
}
export async function parseFileStoreContentItem(_filepath, content, opts) {
    let ext = path.extname(_filepath);
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
            id: 'fileStore',
            optionFields: fileStoresContentOptionFields,
            listContent: async (contentType, opts) => {
                const base = import.meta.url;
                const glob = opts.glob || `${base}/${opts.directory}/` + // base dir
                    `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                        contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                    `${opts.prependText || ''}` + // prependText value
                    `${opts.recursive ? '**/' : ''}` + // recursive
                    `.(${opts?.fileExtensions?.join('|')})`; // file extensions
                const fg = await import('fast-glob');
                return fg.sync(glob).map(f => {
                    let item = fs.readFileSync(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
            },
            getContent: async (contentType, opts, slug = '') => {
                const base = import.meta.url;
                const glob = opts.glob || `${base}/${opts.directory}/` + // base dir
                    `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                        contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                    `${opts.prependText || ''}` + // prependText value
                    `${opts.recursive ? '**/' : ''}` + // recursive
                    `${slug || '*'}` + // one or all?
                    `.(${opts?.fileExtensions?.join('|')})`; // file extensions
                const fg = await import('fast-glob');
                let files = fg.sync(glob).map(f => {
                    let item = fs.readFileSync(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
                return files.length === 1 ? files[0] : files;
            },
            saveContent: async (content, contentType, opts) => {
                if (!opts.slug && !content.slug)
                    throw new Error(`New ${contentType.label} must have a slug`);
                const base = import.meta.url;
                let filepath = content?._filepath ?? (opts.filepath ? `${base}/${opts.filepath}`.replace(/\/+/, '/') : '');
                if (!filepath) {
                    filepath = path.resolve(base, opts.directory, // base dir
                    `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                        contentType.id + (opts.useContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        opts.prependText || '' + // prependText
                        (opts.slug || content.slug) + // slug
                        '.' + opts.saveAsExtension // extension
                    );
                }
                let ext = path.extname(filepath);
                let body = '';
                switch (ext) {
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
                        if (ext === 'md')
                            content = `---\n${content}\n---\n${body}`;
                        break;
                    default:
                        throw new Error('Extension for file stores must be md, json, yml or yaml.');
                }
                fs.writeFileSync(filepath, content);
            },
            deleteContent: async (content, contentType, opts) => {
                const base = import.meta.url;
                let filepath = content._filepath ?? (opts.filepath ? `${base}/${opts.filepath}`.replace(/\/+/, '/') : '');
                if (!filepath)
                    return;
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
