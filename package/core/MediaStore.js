export const templateMediaStore = {
    id: 'mediaStore',
    label: 'Media Store',
    labelPlural: 'Media Stores',
    description: `A Media Store provides storage for images, audio or video, documents, or other files.`,
    typeField: true,
    typeInherits: true,
    typeRequired: true,
    typeRestricted: true,
    isConfigurable: true,
};
export class MediaStore {
    constructor(conf, cms) {
        let store = typeof conf === 'string' ? cms.mediaStores[conf] : cms.mediaStores[conf?.id];
        if (!store)
            store = Object.values(cms.mediaStores)[0];
        this.id = store?.id;
        this.listMedia = store?.listMedia ? store.listMedia.bind(this) : async () => { console.error(store?.id ? `No function 'listMedia' for store '${this.id}'` : `Store ${this.id} not found`); };
        this.getMedia = store?.getMedia ? store.getMedia.bind(this) : async () => { console.error(store?.id ? `No function 'getMedia' for store '${this.id}'` : `Store ${this.id} not found`); };
        this.saveMedia = store?.saveMedia ? store.saveMedia.bind(this) : async () => { console.error(store?.id ? `No function 'saveMedia' for store '${this.id}'` : `Store ${this.id} not found`); };
        this.deleteMedia = store?.deleteMedia ? store.deleteMedia.bind(this) : async () => { console.error(store?.id ? `No function 'deleteMedia' for store '${this.id}'` : `Store ${this.id} not found`); };
        // this.getPreview = store?.getPreview ? store.getPreview.bind(this) : undefined
        // this.deletePreview = store?.deletePreview ? store.deletePreview.bind(this) : undefined
        this.options = cms.getInstanceOptions(store, conf);
        this.immediateUpload = Boolean(this.options.immediateUpload) || store.immediateUpload;
    }
}
export default MediaStore;
