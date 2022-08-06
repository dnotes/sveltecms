import { splitTags } from 'sveltecms/utils';
export function isIndexItem(item) {
    return item?._type !== undefined;
}
function noop(val) { return async () => { return val; }; }
export const templateIndexer = {
    id: 'indexer',
    label: 'Indexer',
    labelPlural: 'Indexers',
    description: 'An Indexer maintains an index of content and media.',
    typeField: true,
    typeInherits: true,
    typeRequired: true,
    typeRestricted: true,
    isConfigurable: true,
    configFields: {
        mediaKeys: {
            type: 'text',
            default: 'type,size,height,width,duration,date',
            helptext: 'The media fields to index for media from a particular Media Store.'
        }
    }
};
export class Indexer {
    constructor(conf, cms) {
        this.getIndex = noop();
        this.saveIndex = noop();
        this.searchIndex = noop();
        this.saveContent = noop();
        this.deleteContent = noop();
        this.saveMedia = noop();
        this.deleteMedia = noop();
        this.searchContent = noop([]);
        this.searchMedia = noop([]);
        this.mediaKeys = ['type', 'size', 'height', 'width', 'duration', 'date'];
        this.options = {};
        if (typeof conf === 'string')
            conf = { type: conf };
        let indexer = cms.indexers[conf.type];
        if (!indexer)
            return this;
        this.getIndex = indexer.getIndex.bind(this);
        this.updateIndex = indexer.updateIndex.bind(this);
        this.saveIndex = indexer.saveIndex.bind(this);
        this.searchIndex = indexer.searchIndex.bind(this);
        this.saveContent = indexer.saveContent.bind(this);
        this.deleteContent = indexer.deleteContent.bind(this);
        this.saveMedia = indexer.saveMedia.bind(this);
        this.deleteMedia = indexer.deleteMedia.bind(this);
        this.searchContent = indexer.searchContent.bind(this);
        this.searchMedia = indexer.searchMedia.bind(this);
        if (conf.hasOwnProperty('mediaKeys'))
            this.mediaKeys = typeof conf.mediaKeys === 'string' ? splitTags()(conf.mediaKeys) : (conf.mediaKeys || []);
        this.options = cms.mergeConfigOptions(cms.getConfigOptionsFromFields(indexer.optionFields || {}), conf);
    }
}
export default Indexer;
