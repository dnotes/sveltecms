import { isBrowser, isWebWorker, isJsDom } from 'browser-or-node';
import bytes from 'bytes';
import { cloneDeep, difference, sortBy } from 'lodash-es';
import { dirname } from '../../utils/path';
import Fuse from 'fuse.js';
import { findReferenceIndex } from '../../utils';
const fs = {};
const allIndexes = import.meta.glob('/src/content/_*.index.json', { eager: true });
const allContent = import.meta.glob('/src/content/*/**/*.{md,yml,yaml,json}', { as: 'raw' });
function extname(path) { return path.replace(/^.+\//, '').replace(/^[^\.].*\./, '').replace(/^\..+/, ''); }
function getBasedir() { return (isBrowser || isWebWorker) ? '/' : import.meta.url.replace(/\/(?:node_modules|src|\.yalc)\/.+/, '').replace(/^file:\/\/\//, '/'); }
export async function getFs(databaseName) {
    if (fs[databaseName])
        return fs[databaseName];
    if (isBrowser || isWebWorker) {
        const { default: FS } = await import('@isomorphic-git/lightning-fs');
        let _fs = new FS(databaseName);
        fs[databaseName] = _fs.promises;
    }
    else {
        if (isJsDom)
            console.warn('Use of jsdom is untested and unsupported by SvelteCMS');
        const { promises } = await import('fs');
        // @ts-ignore: todo: how to get the type for fs/promises
        fs[databaseName] = promises;
    }
    return fs[databaseName];
}
export const databaseNameField = {
    type: 'text',
    default: '',
    helptext: 'The name used for saving files in-browser. This is required if you are using the browser-based filesystem. ' +
        'It should be globally unique and generally should be the same across one site or app; your site url might be a good choice. ' +
        'At the moment, if you are using something like isomorphic-git, you must import content into the browser filesystem yourself.',
};
export const staticFilesContentOptionFields = {
    contentDirectory: {
        type: 'text',
        default: 'src/content',
        helptext: 'The directory for local content files relative to the project root. ' +
            'At the moment, this is hard-coded to "src/content", and changing it can break ' +
            'listing and getting content for that Content Type during `vite build` processes.'
    },
    fileExtension: {
        type: 'text',
        default: 'md',
        required: true,
        widget: {
            type: 'select',
            options: {
                items: [
                    'md:.md (Markdown)',
                    'json:.json (JSON)',
                    'yml:.yml (YAML)',
                    'yaml:.yaml (YAML)',
                ]
            }
        },
        helptext: 'What type of file to use for new content; must be one of "md", "json", "yml", or "yaml"',
    },
    markdownBodyField: {
        type: 'text',
        default: 'body',
        helptext: 'Which field should be used as the body of the Markdown file',
    },
};
export const staticFilesMediaOptionFields = {
    staticDirectory: {
        type: 'text',
        default: 'static',
        helptext: 'The directory for static files relative to the project root. For SvelteKit projects this is "static" by default.'
    },
    mediaDirectory: {
        type: 'text',
        default: '',
        helptext: 'The directory for media files relative to the static directory.',
    },
    maxUploadSize: {
        type: 'text',
        default: "",
        helptext: 'The maximum file size allowed for media uploads, e.g. "10MB". Empty or 0 for unlimited.'
    },
};
export async function parseFileStoreContentItem(_filepath, content, opts) {
    let ext = extname(_filepath);
    if (ext === 'json')
        return { ...JSON.parse(content) };
    else {
        const yaml = await import('js-yaml');
        if (ext === 'yml' || ext === 'yaml')
            return { ...yaml.load(content) };
        else if (ext === 'md') {
            let sections = content.split(/^---[\r\n]+/gm);
            if (sections.length > 2 && sections.shift() === '') {
                let data;
                try {
                    data = yaml.load(sections.shift());
                }
                catch (e) { } // The yaml would not load.
                if (data)
                    return { ...data, [opts.markdownBodyField]: sections[0] };
                else
                    return { [opts.markdownBodyField]: content };
            }
        }
        else
            throw new Error('Extension for file stores must be md, json, yml or yaml.');
    }
}
export function getSlugFromFilepath(filepath, contentTypeID, opts) {
    let slug = filepath.replace(/.+\//, '').replace(/\.[^\.]*$/, '');
    return slug;
}
const plugin = {
    id: 'staticFiles',
    contentStores: [
        {
            id: 'staticFiles',
            optionFields: { databaseName: databaseNameField, ...staticFilesContentOptionFields },
            listContent: async (contentType, opts) => {
                let type = contentType.id;
                let index = allIndexes?.[type]?.default ?? [];
                let content = [];
                await Promise.all(Object.keys(allContent)
                    .filter(path => path.indexOf(`/src/content/${type}/`) === 0)
                    .map(path => async () => {
                    if (opts.full)
                        content.push(await parseFileStoreContentItem(path, await allContent[path](), opts));
                    else {
                        let slug = getSlugFromFilepath(path, type, opts);
                        content.push(index.find(item => item._slug === slug) ?? { _type: type, _slug: slug });
                    }
                }));
                if (!content.length) {
                    try {
                        const fs = await getFs('opts.databaseName');
                        let glob = opts.glob ? `${getBasedir()}/${opts.glob}` : `${getBasedir()}/${opts.contentDirectory}/${contentType.id}/*.${opts.fileExtension}`;
                        glob = glob.replace(/\/+/g, '/');
                        const { default: fg } = await import('fast-glob');
                        const paths = await fg(glob);
                        await Promise.all(paths.map(path => async () => {
                            if (opts.full)
                                content.push(parseFileStoreContentItem(path, await allContent[path](), opts));
                            else {
                                let slug = getSlugFromFilepath(path, type, opts);
                                content.push(index.find(item => item._slug === slug) ?? { _type: type, _slug: slug });
                            }
                        }));
                    }
                    catch (e) {
                        console.error(`Error listing content for type "${contentType.id}": ${e.message}`);
                    }
                }
                return content;
            },
            getContent: async (contentType, opts, slug = '') => {
                slug = slug || opts.slug || '*';
                // Try to get with Vite
                let filepath = `/src/content/${contentType?.id ?? contentType}/${slug}.${opts.fileExtension}`;
                let item = allContent?.[filepath];
                if (item) {
                    let text = await item();
                    let content = await parseFileStoreContentItem(filepath, text, opts);
                    if (content)
                        return content;
                }
                try {
                    // This will happen if Vite is unavailable or if a non-existent slug is requested
                    const fs = await getFs('opts.databaseName');
                    let glob = opts.glob ? `${getBasedir()}/${opts.glob}` : `${getBasedir()}/${opts.contentDirectory}/${contentType.id}/*.${opts.fileExtension}`;
                    glob = glob.replace(/\/+/g, '/');
                    const { default: fg } = await import('fast-glob');
                    const items = await fg(glob);
                    const files = items.map(async (f) => {
                        let item = await fs.readFile(f, { encoding: 'utf8' });
                        return parseFileStoreContentItem(f, item, opts);
                    });
                    await Promise.all(files);
                    return files.length === 1 ? files[0] : files;
                }
                catch (e) {
                    console.error(`Error fetching content "${contentType.id}/${slug}": ${e.message}`);
                }
                return {};
            },
            saveContent: async (content, contentType, opts) => {
                let slug = opts.slug ?? content._slug ?? content.slug;
                if (!slug && !opts.filepath)
                    throw new Error(`Content to be saved must have a slug or a provided filepath: ${contentType.label}\n - opts.slug: ${opts.slug}\n - content._slug: ${content._slug}\n - content.slug: ${content.slug}`);
                const fs = await getFs('opts.databaseName');
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` : `${getBasedir()}/${opts.contentDirectory}/${contentType.id}/${slug}.${opts.fileExtension}`;
                let body = '';
                let saveContent = cloneDeep(content);
                switch (opts.fileExtension) {
                    case "json":
                        saveContent = JSON.stringify(saveContent, null, 2);
                        break;
                    case "md":
                        body = saveContent[opts.markdownBodyField] || '';
                        delete (saveContent[opts.markdownBodyField]);
                    case "yml":
                    case "yaml":
                        let yaml = await import('js-yaml');
                        saveContent = yaml.dump(saveContent).trim();
                        if (opts.fileExtension === 'md')
                            saveContent = `---\n${saveContent}\n---\n${body}`;
                        break;
                    default:
                        throw new Error('Extension for file stores must be md, json, yml or yaml.');
                }
                try {
                    await mkdirp(fs, dirname(filepath));
                    await fs.writeFile(filepath, saveContent.replace(/\r\n/g, '\n'));
                    return content;
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
                const fs = await getFs('opts.databaseName');
                let filepath = opts.filepath ? `${getBasedir()}/${opts.filepath}` : `${getBasedir()}/${opts.contentDirectory}/${contentType.id}/${slug}.${opts.fileExtension}`;
                try {
                    await fs.unlink(filepath);
                    return content;
                }
                catch (e) {
                    e.message = `Error deleting ${filepath}:\n${e.message}`;
                    throw e;
                }
            },
        }
    ],
    indexers: [
        {
            id: 'staticFiles',
            optionFields: {
                databaseName: databaseNameField,
            },
            getIndex: async function (id) {
                await allIndexes;
                if (allIndexes?.[`/src/content/_${id}.index.json`])
                    return allIndexes[`/src/content/_${id}.index.json`].default;
                const fs = await getFs(this?.options?.databaseName);
                const filepath = `${getBasedir()}/src/content/_${id}.index.json`;
                let index = [];
                try {
                    // @ts-ignore This should be absolutely a string
                    index = JSON.parse(await fs.readFile(filepath, 'utf8'));
                }
                catch (e) {
                    try {
                        let contentTypeID = filepath.replace(/.+\/_/, '').replace(/\..+/, '');
                        let fetchedIndex = await fetch(`/${contentTypeID}/__data.json`).then(async (res) => { return (await res.json())?.content ?? []; });
                        index = fetchedIndex;
                    }
                    catch (e) {
                        console.warn(e.message);
                        // just continue with empty index
                    }
                }
                return index;
            },
            updateIndex: async function (id, changes) {
                let index = await this.getIndex(id);
                changes.forEach(change => {
                    // get the index of the item
                    let i = findReferenceIndex(change.before, index);
                    // For deleted items
                    if (!change.after) {
                        if (i !== -1)
                            index.splice(i, 1);
                    }
                    // For changed items
                    else if (i !== -1) {
                        index.splice(i, 1, change.after);
                    }
                    // For added items
                    else {
                        index.unshift(change.after);
                    }
                });
                await this.saveIndex(id, index);
            },
            saveIndex: async function (id, index) {
                const fs = await getFs(this?.options?.databaseName);
                const filepath = `${getBasedir()}/src/content/_${id}.index.json`;
                try {
                    await mkdirp(fs, dirname(filepath));
                    let res = fs.writeFile(filepath, '[\n' + index.map(item => JSON.stringify(item)).join(',\n') + '\n]');
                    return res;
                }
                catch (e) {
                    e.message = `Indexer staticFiles could not save index: ${filepath}\n` + e.message;
                    throw e;
                }
            },
            searchIndex: async function (id, search, options) {
                if (!this?._indexes)
                    this._indexes = {};
                if (!this._indexes[id]) {
                    let index = await this.getIndex(id);
                    this._indexes[id] = new Fuse(index, options);
                }
                let index = await this._indexes[id];
                if (!search)
                    return index._docs;
                return index.search(search, { includeScore: true }).map(res => ({ ...res.item, _score: res?.score }));
            },
            saveContent: async function (contentType, content) {
                let id = contentType?.['id'] ?? contentType;
                let index = await this.getIndex(id);
                content = Array.isArray(content) ? content : [content];
                content.forEach(item => {
                    let i = index.findIndex(indexedItem => item._slug === indexedItem._slug);
                    if (i > -1)
                        index[i] = item;
                    else
                        index.unshift(item);
                    // If the slug has changed, remove the index entry for the old slug
                    if (item._oldSlug && (item._oldSlug !== item._slug)) {
                        i = index.findIndex(item => item._slug === item._oldSlug);
                        if (i > -1)
                            index.splice(i, 1);
                    }
                });
                // Unset the cached search index for this content type
                if (this?._indexes?.[id])
                    this._indexes[id] = undefined;
                return this.saveIndex(id, index);
            },
            deleteContent: async function (contentType, content) {
                let id = contentType?.['id'] ?? contentType;
                let index = await this.getIndex(id);
                content = Array.isArray(content) ? content : [content];
                content.forEach(item => {
                    // Find the exact item in the index
                    let slug = item._oldSlug ?? item._slug;
                    let i = index.findIndex(item => item._slug === slug);
                    // If the item is not in the index, just return
                    if (i === -1)
                        return;
                    // Remove the item from the index
                    index.splice(i, 1);
                });
                // Unset the cached search index for this content type
                if (this?._indexes?.[id])
                    this._indexes[id] = undefined;
                return this.saveIndex(id, index);
            },
            searchContent: async function (contentType, search, options = {}) {
                let keys = [...(contentType?.['indexFields'] || []), '_slug'];
                return this.searchIndex(contentType?.['id'] ?? contentType, search, { keys, ...options });
            },
            indexMedia: async function (changeset, cms, options) {
                let beforeContent = changeset.before;
                let afterContent = changeset.after;
                let slugs = []; // we will remove all usage items that match these slugs...
                let usageItems = [];
                let index = await this.getIndex('_media');
                let usage = await this.getIndex('_media_usage');
                for (let i = 0; i < changeset.after.length; i++) {
                    if (afterContent[i]) { // Item has been saved
                        let media = afterContent[i]?._media?.filter(item => item && item?.value?.src);
                        // Remove usage for the slug
                        slugs.push(afterContent[i]._slug);
                        // If the slug has been changed, remove usage for the old slug
                        if (afterContent[i]?.oldSlug && afterContent[i]._oldSlug !== afterContent[i]._slug)
                            slugs.push(afterContent[i]._oldSlug);
                        if (media && media?.length) {
                            media.forEach(item => {
                                // Add the usage record for each Media item
                                usageItems.push({
                                    src: item.value.src,
                                    contentType: changeset.contentType.id,
                                    slug: afterContent[i]._slug,
                                    path: item.usage,
                                });
                                // If there is no index item, add it
                                if (!index.find(indexItem => indexItem.src === item.value.src))
                                    index.unshift(item.value);
                            });
                        }
                    }
                    else { // Item has been deleted
                        slugs.push(beforeContent[i]._oldSlug ?? beforeContent[i]._slug);
                    }
                }
                usage = usage.filter(item => !(item.contentType === changeset.contentType.id && slugs.includes(item.slug)));
                usage = sortBy([...usage, ...usageItems], ['src', 'contentType', 'slug', 'path']);
                this.saveIndex('_media', index);
                this.saveIndex('_media_usage', usage);
            },
            saveMedia: async function (allMedia) {
                let index = await this.getIndex('_media');
                allMedia = Array.isArray(allMedia) ? allMedia : [allMedia];
                allMedia.forEach(media => {
                    let item = { src: media.src };
                    (this.mediaKeys || []).forEach(k => { item[k] = media[k]; });
                    let i = index.findIndex(item => item.src === media.src);
                    if (i > -1)
                        index[i] = item;
                    else
                        index.unshift(item);
                });
                if (this?._indexes?._media)
                    this._indexes._media = undefined;
                return this.saveIndex('_media', index);
            },
            deleteMedia: async function (allMedia) {
                let index = await this.getIndex('_media');
                allMedia = Array.isArray(allMedia) ? allMedia : [allMedia];
                allMedia.forEach(media => {
                    let i = index.findIndex(item => item.src === media.src);
                    if (i === -1)
                        return;
                    index.splice(i, 1);
                });
                if (this?._indexes?._media)
                    this._indexes._media = undefined;
                return this.saveIndex('_media', index);
            },
            searchMedia: async function (search, options = {}) {
                return this.searchIndex('_media', search, { keys: this.mediaKeys, ...options });
            },
        }
    ],
    mediaStores: [
        {
            id: 'staticFiles',
            optionFields: { databaseName: databaseNameField, ...staticFilesMediaOptionFields },
            saveMedia: async (file, opts) => {
                let maxUploadSize = bytes.parse(opts.maxUploadSize);
                if (maxUploadSize && file.size > maxUploadSize)
                    throw new Error(`${file.name} exceeds maximum upload size of ${opts.maxUploadSize}`);
                // Get file system
                const fs = await getFs('opts.databaseName');
                let basedir = getBasedir();
                const filepath = [basedir, opts.staticDirectory, opts.mediaDirectory, file.name].filter(Boolean).join('/');
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
                    await mkdirp(fs, dirname(filepath));
                    const buffer = await file.arrayBuffer();
                    const uint8 = new Uint8Array(buffer);
                    await fs.writeFile(filepath, uint8);
                    return opts.mediaDirectory ? `/${opts.mediaDirectory}/${file.name}` : `/${file.name}`;
                }
                catch (e) {
                    throw e;
                }
            },
            deleteMedia: async (file, opts) => {
                const fs = await getFs('opts.databaseName');
                throw new Error('Deleting local media is not yet implemented');
                return '';
            },
        }
    ],
    hooks: [
        {
            type: 'contentPostWrite',
            label: 'Admin Tasks for Static Files',
            description: 'Runs after saving the SvelteCMS configuration, to ensure creation of local index files.',
            fn: async (change, cms) => {
                if (change.contentType.id === 'admin' && change.after?.contentTypes) {
                    // Save the index file for new content types
                    let newContentTypes = difference(Object.keys(change.after.contentTypes), Object.keys(change?.before?.contentTypes ?? {}));
                    if (newContentTypes.length) {
                        for (let i = 0; i < newContentTypes.length; i++) {
                            let contentTypeID = newContentTypes[i];
                            let contentType = change.after.contentTypes[contentTypeID];
                            let indexerType = contentType?.indexer?.type ?? contentType?.indexer ?? cms.indexer.type;
                            let indexerRoot = cms.getEntityRoot('indexers', indexerType);
                            if (indexerRoot?.id === 'staticFiles') {
                                try {
                                    await cms.indexers[indexerType].saveIndex(contentTypeID, []);
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
};
/**
 * taken from https://github.com/isaacs/node-mkdirp
 * @param path
 * @param fs a filesystem adapter, either node's fs or a lightning-fs
 * @returns
 */
export async function mkdirp(fs, path, opts, made) {
    const parent = dirname(path);
    if (parent === path) {
        return fs.mkdir(path).catch(er => {
            // swallowed by recursive implementation on posix systems
            // any other error is a failure
            if (er.code !== 'EISDIR')
                throw er;
        });
    }
    return fs.mkdir(path).then(() => made || path, er => {
        if (er.code === 'ENOENT')
            return mkdirp(fs, parent, opts)
                .then(made => mkdirp(fs, path, opts, made));
        if (er.code !== 'EEXIST' && er.code !== 'EROFS')
            throw er;
        return fs.stat(path).then(st => {
            if (st.isDirectory())
                return made;
            else
                throw er;
        }, () => { throw er; });
    });
}
export default plugin;
