import { SlugConfig } from 'sveltecms/core/Slug';
import { ContentStore } from 'sveltecms/core/ContentStore';
import Field, {} from 'sveltecms/core/Field';
import { getLabelFromID, splitTags } from 'sveltecms/utils';
export const templateContentType = {
    id: 'contentType',
    label: 'Content Type',
    labelPlural: 'Content Types',
    description: `Content Types are the basic data structures of SvelteCMS. Each Content Type specifies how to enter, save, retrieve, display, and delete a document of its type.`,
    typeField: false,
    isFieldable: true,
    isConfigurable: true,
    configFields: {
        label: {
            type: 'text',
            default: '',
            helptext: 'The label for the content type.',
        },
        contentStore: {
            type: 'entity',
            required: true,
            default: undefined,
            helptext: 'The content store which will hold the content.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'contentStore',
                }
            }
        },
        mediaStore: {
            type: 'entity',
            required: true,
            default: undefined,
            helptext: 'The content store which will hold the content.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'mediaStore',
                }
            }
        },
        slug: {
            type: 'entity',
            required: true,
            default: '',
            helptext: 'The fields used for the slug of the content type.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'slug',
                }
            }
        },
        display: {
            type: 'entity',
            default: '',
            helptext: '',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'display'
                }
            }
        },
        displayModes: {
            type: 'entityList',
            default: {},
            helptext: 'Display configurations which override the default display for a display mode. ' +
                'Display modes used by SvelteCMS include: "page", "teaser", and "reference".',
            widget: {
                type: 'entityList',
                options: {
                    entityType: 'display',
                }
            }
        },
    }
};
export class ContentType {
    constructor(id, conf, cms) {
        this.label = '';
        this.isFieldable = true;
        this.fields = {};
        this.id = id;
        this.label = conf.label || getLabelFromID(this.id);
        this.contentStore = new ContentStore(conf?.contentStore, cms);
        this.mediaStore = conf.mediaStore;
        this.display = conf.display ?? cms.conf?.settings?.defaultContentDisplay ?? 'div';
        this.displayModes = conf.displayModes ?? cms.conf?.settings?.defaultContentDisplayModes;
        this.indexFields = [];
        this.form = {
            method: conf?.form?.method,
            action: conf?.form?.action,
        };
        Object.entries(conf.fields || {}).forEach(([id, conf]) => {
            this.fields[id] = new Field(id, conf, cms, this);
        });
        let slugConf = conf.slug || Object.keys(conf.fields)?.[0] || '';
        this.slug = new SlugConfig(slugConf, cms);
        this.indexFields = cms.findFields(this.fields, f => f.index ? true : false);
    }
}
export default ContentType;
