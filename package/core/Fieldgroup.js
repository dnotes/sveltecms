import Field, {} from "./Field";
export const templateFieldgroup = {
    id: 'fieldgroup',
    label: 'Field Group',
    labelPlural: 'Field Groups',
    description: `A Field Group is a group of Fields.`,
    typeField: true,
    typeInherits: true,
    isConfigurable: true,
    isFieldable: true,
    configFields: {
        display: {
            type: 'entity',
            default: '',
            helptext: 'The element or component used to display this fieldgroup.',
            widget: {
                type: 'entity',
                options: {
                    entityType: 'display',
                },
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
export class Fieldgroup {
    constructor(conf, cms) {
        this.isFieldable = true;
        conf = typeof conf === 'string' ? cms.fieldgroups[conf] : conf;
        this.id = conf.id;
        this.admin = conf.admin;
        this.type = conf.type || conf.id;
        this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id, conf]) => {
            return [id, new Field(id, conf, cms)];
        }));
    }
}
export default Fieldgroup;
