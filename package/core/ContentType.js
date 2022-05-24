import { SlugConfig } from 'sveltecms/core/Slug';
import { ContentStore } from 'sveltecms/core/ContentStore';
import Field, {} from 'sveltecms/core/Field';
import { getLabelFromID } from 'sveltecms/utils';
export class ContentType {
    constructor(id, conf, cms) {
        this.label = '';
        this.isFieldable = true;
        this.fields = {};
        this.id = id;
        this.label = conf.label || getLabelFromID(this.id);
        this.contentStore = new ContentStore(conf?.contentStore, cms);
        this.mediaStore = conf.mediaStore;
        this.previewComponent = conf.previewComponent;
        this.form = {
            method: conf?.form?.method,
            action: conf?.form?.action,
        };
        Object.entries(conf.fields).forEach(([id, conf]) => {
            this.fields[id] = new Field(id, conf, cms, this);
        });
        let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || '';
        this.slug = new SlugConfig(slugConf, cms);
    }
}
export default ContentType;
