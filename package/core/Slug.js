import splitTags from 'sveltecms/utils/splitTags';
const split = splitTags();
export const templateSlug = {
    id: 'slug',
    label: 'Slug',
    labelPlural: 'Slugs',
    description: `A Slug configuration specifies how SvelteCMS will create a "slug" for each piece of content. Slugs are strings of characters, ` +
        `usually only lowercase letters and numbers, dashes, and underscores. SvelteCMS uses slugs to index and reference content. ` +
        `Each piece of content in any content type must have a unique slug. By default, the slug will form a part of the URL at which the content is available.`,
    typeField: 'fields',
    configFields: {
        fields: {
            type: 'text',
            multiple: true,
            multipleOrSingle: true,
            default: [],
            widget: 'multiselect',
            helptext: 'A comma-separated list of field IDs. The value of those fields ' +
                'are combined to form the slug, which is used as the key in key-value databases ' +
                'and as part of the URL for viewing the content on a website.',
        },
        separator: {
            type: 'text',
            default: '-',
            helptext: 'The separator character will be placed between words in the slug.'
        },
        slugify: {
            type: 'entity',
            multiple: true,
            multipleOrSingle: true,
            default: '',
            helptext: 'Any transformers to apply in creating the slug. Transformers are applied ' +
                'to each field value individually, then the results combined.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'transformer',
                }
            }
        }
    }
};
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
