const noStore = async () => {
    // @ts-ignore
    console.error(`Store not found: (${this?.['id'] || ''})`);
    return {};
};
export const templateContentStore = {
    id: 'contentStore',
    label: 'Content Store',
    labelPlural: 'Content Stores',
    description: `A Content Store connects with some type of database or file system to provide storage for content managed by SvelteCMS.`,
    typeField: true,
    typeInherits: true,
    typeRequired: true,
    typeRestricted: true,
    isConfigurable: true,
};
export class ContentStore {
    constructor(conf, cms) {
        if (!conf)
            conf = { type: 'staticFiles' };
        else if (typeof conf === 'string')
            conf = { type: conf };
        let store = cms.contentStores[conf?.type] || cms.contentStores[conf?.id];
        if (!store)
            store = Object.values(cms.contentStores)[0];
        this.id = store.id;
        this.type = conf.type;
        this.listContent = store?.listContent || (async () => { console.error(`Store not found: (${this?.['id']})`); return []; });
        this.getContent = store?.getContent || noStore;
        this.saveContent = store?.saveContent || noStore;
        this.deleteContent = store?.deleteContent || noStore;
        this.options = cms.getInstanceOptions(store, conf);
    }
}
export default ContentStore;
