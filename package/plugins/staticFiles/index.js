import formDataHandler from '../../utils/formDataHandler';
import { isBrowser, isWebWorker, isJsDom } from 'browser-or-node';
const fs = {};
function extname(path) { return path.replace(/^.+\//, '').replace(/^[^\.].*\./, '').replace(/^\..+/, ''); }
function getBasedir() { return (isBrowser || isWebWorker) ? '' : import.meta.url.replace(/\/node_modules\/.+/, '').replace(/^file:\/\/\//, '/'); }
export async function getFs(databaseName) {
    if (isBrowser || isWebWorker) {
        if (!fs[databaseName]) {
            const { default: FS } = await import('@isomorphic-git/lightning-fs');
            let _fs = new FS(databaseName);
            fs[databaseName] = _fs.promises;
        }
        return fs[databaseName];
    }
    if (isJsDom)
        console.warn('Use of jsdom is untested and unsupported by SvelteCMS');
    const { promises } = await import('fs');
    // @ts-ignore: todo: how to get the type for fs/promises
    return promises;
}
export const databaseNameField = {
    type: 'text',
    default: '',
    tooltip: 'The name used for saving files in-browser. This is required if you are using the browser-based filesystem. ' +
        'It should be globally unique and generally should be the same across one site or app; your site url might be a good choice. ' +
        'At the moment, if you are using something like isomorphic-git, you must import content into the browser filesystem yourself.',
};
export const staticFilesContentOptionFields = {
    contentDirectory: {
        type: 'text',
        default: 'content',
        tooltip: 'The directory for local content files relative to the project root.',
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
export const staticFilesMediaOptionFields = {
    staticDirectory: {
        type: 'text',
        default: 'static',
        tooltip: 'The directory for static files relative to the project root. For SvelteKit projects this is "static" by default.'
    },
    mediaDirectory: {
        type: 'text',
        default: '',
        tooltip: 'The directory for media files relative to the static directory.',
    },
    allowMediaTypes: {
        type: 'tags',
        default: 'image/*',
        tooltip: 'A comma-separated list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
    },
    maxUploadSize: {
        type: 'text',
        default: "",
        tooltip: 'The maximum file size allowed for media uploads, e.g. "10MB". Empty or 0 for unlimited.'
    },
};
export async function saveContentEndpoint(cms, contentTypeID, request, options = {}) {
    let content;
    try {
        let formdata = await request.formData();
        content = await formDataHandler(cms, contentTypeID, formdata);
        let response = await cms.saveContent(contentTypeID, content, options);
        return response;
    }
    catch (error) {
        return {
            status: 500,
            body: {
                message: error.message,
                stack: error.stack.split('\n'),
                content,
            }
        };
    }
}
export async function deleteContentEndpoint(cms, contentTypeID, request, options = {}) {
    let content;
    try {
        let formdata = await request.formData();
        content = await formDataHandler(cms, contentTypeID, formdata);
        let response = await cms.deleteContent(contentTypeID, content, options);
        return response;
    }
    catch (error) {
        return {
            status: 500,
            body: {
                message: error.message,
                stack: error.stack.split('\n'),
                content,
            }
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
function bytes(text) {
    let num = parseInt(text);
    if (isNaN(num))
        return 0;
    let multiplier = {
        b: 1,
        k: 1024,
        m: 1024 * 1024,
        g: 1024 * 1024 * 1024,
    }[(text.toLowerCase().match(/^[\s\d]+(k|m|g)/) || [])[1] || 'b'];
    return num * multiplier;
}
const plugin = {
    contentStores: [
        {
            id: 'staticFiles',
            optionFields: { databaseName: databaseNameField, ...staticFilesContentOptionFields },
            listContent: async (contentType, opts) => {
                const fs = await getFs(opts.databaseName);
                let glob = opts.glob ? `${getBasedir()}/${opts.glob}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.prependContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `*.${opts.fileExtension}`; // file extensions
                glob = glob.replace(/\/+/g, '/');
                const { default: fg } = await import('fast-glob');
                const items = await fg(glob, { fs });
                const files = items.map(async (f) => {
                    let item = await fs.readFile(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
                await Promise.all(files);
                return files;
            },
            getContent: async (contentType, opts, slug = '') => {
                slug = slug || opts.slug || '*';
                const fs = await getFs(opts.databaseName);
                let glob = opts.glob ? `${getBasedir()}/${opts.glob}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.prependContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `${slug}.${opts.fileExtension}`; // file extensions
                glob = glob.replace(/\/+/g, '/');
                const { default: fg } = await import('fast-glob');
                const items = await fg(glob, { fs });
                const files = items.map(async (f) => {
                    let item = await fs.readFile(f, { encoding: 'utf8' });
                    return parseFileStoreContentItem(f, item, opts);
                });
                await Promise.all(files);
                return files.length === 1 ? files[0] : files;
            },
            saveContent: async (content, contentType, opts) => {
                let slug = opts.slug ?? content._slug ?? content.slug;
                if (!slug && !opts.filepath)
                    throw new Error(`Content to be saved must have a slug or a provided filepath: ${contentType.label}\n - opts.slug: ${opts.slug}\n - content._slug: ${content._slug}\n - content.slug: ${content.slug}`);
                const fs = await getFs(opts.databaseName);
                const base = `${getBasedir()}/${opts.contentDirectory}/`;
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.prependContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
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
                try {
                    await fs.writeFile(filepath, content);
                    return {
                        status: 200,
                        body: {
                            action: 'saved',
                            filepath,
                            content,
                        }
                    };
                }
                catch (e) {
                    e.message = `Error writing ${filepath}:\n${e.message}`;
                    throw e;
                }
            },
            deleteContent: async (content, contentType, opts) => {
                let slug = opts.slug ?? content._slug ?? content.slug;
                if (!slug && !opts.filepath)
                    throw new Error(`Content to be deleted must have a slug or a provided filepath: ${contentType.label}`);
                const fs = await getFs(opts.databaseName);
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` :
                    `${getBasedir()}/${opts.contentDirectory}/` + // base dir
                        `${opts.prependContentTypeIdAs ? // content type, as directory or prefix
                            contentType.id + (opts.prependContentTypeIdAs === 'directory' ? '/' : '_') : ''}` +
                        `${slug}.${opts.fileExtension}`; // file extensions
                try {
                    await fs.unlink(filepath);
                    return {
                        status: 200,
                        body: {
                            action: 'deleted',
                            filepath,
                            content
                        }
                    };
                }
                catch (e) {
                    e.message = `Error deleting ${filepath}:\n${e.message}`;
                    throw e;
                }
            },
        }
    ],
    mediaStores: [
        {
            id: 'staticFiles',
            optionFields: { databaseName: databaseNameField, ...staticFilesMediaOptionFields },
            saveMedia: async (file, opts) => {
                // Check media for validity
                let mediaTypes = opts.allowMediaTypes.split(/\s*,\s*/);
                if (!mediaTypes.includes(file.type) && // exact type
                    !mediaTypes.includes(file.type.replace(/\/.+/, '/*')) && // wildcard type
                    !mediaTypes.includes(file.name.replace(/^.+\./, '.')) // file extension
                )
                    throw new Error(`${file.name} is not among the allowed media types (${mediaTypes.join(', ')}).`);
                let maxUploadSize = bytes(opts.maxUploadSize);
                if (maxUploadSize && file.size > maxUploadSize)
                    throw new Error(`${file.name} exceeds maximum upload size of ${opts.maxUploadSize}`);
                // Get file system
                const fs = await getFs(opts.databaseName);
                const filepath = `${getBasedir()}/${opts.staticDirectory}/${opts.mediaDirectory}/${file.name}`.replace(/\/+/g, '/');
                // TODO: determine what to do if files exist
                let fileStats;
                try {
                    fileStats = await fs.stat(filepath);
                }
                catch (e) {
                    if (e.code === 'ENOENT')
                        fileStats = false;
                }
                try {
                    const buffer = await file.arrayBuffer();
                    const uint8 = new Uint8Array(buffer);
                    await fs.writeFile(filepath, uint8);
                    return `/${opts.mediaDirectory}/${file.name}`;
                }
                catch (e) {
                    throw e;
                }
            },
            deleteMedia: async (file, opts) => {
                const fs = await getFs(opts.databaseName);
                return '';
            },
        }
    ],
};
export default plugin;
