import { splitTags } from 'sveltecms/utils';
const split = splitTags();
export class SlugConfig {
    constructor(conf, cms) {
        this.separator = '-';
        this.slugify = ['removeTimestamp', 'slugify'];
        if (typeof conf === 'string') {
            this.fields = split(conf);
        }
        else if (Array.isArray(conf)) {
            this.fields = conf;
        }
        else {
            this.fields = typeof conf.fields === 'string' ? split(conf.fields) : conf.fields;
            if (conf.slugify)
                this.slugify = conf.slugify;
        }
        return this;
    }
}
export default SlugConfig;
