const noStore = async () => {
    // @ts-ignore
    console.error(`Store not found: (${this?.['id'] || ''})`);
    return {};
};
export class ContentStore {
    constructor(conf, cms) {
        let store = typeof conf === 'string' ? cms.contentStores[conf] : (cms.contentStores[conf?.type] || cms.contentStores[conf?.id]);
        if (!store)
            store = Object.values(cms.contentStores)[0];
        this.id = store?.id;
        this.listContent = store?.listContent || (async () => { console.error(`Store not found: (${this?.['id']})`); return []; });
        this.getContent = store?.getContent || noStore;
        this.saveContent = store?.saveContent || noStore;
        this.deleteContent = store?.deleteContent || noStore;
        this.options = cms.getInstanceOptions(store, conf);
    }
}
export default ContentStore;
