import Field, {} from "./Field";
export const templateFieldgroup = {
    id: 'fieldgroup',
    label: 'Fieldgroup',
    labelPlural: 'Fieldgroups',
    description: `A Fieldgroup is a group of Fields which may be displayed by a Component.`,
    typeField: false,
    isConfigurable: true,
    isDisplayable: true,
    isFieldable: true,
    listFields: ['tags'],
    configFields: {
        tags: {
            type: 'text',
            multiple: true,
            default: [],
            helptext: 'Fields with "Use Components" checked can specify which Fieldgroups may be chosen by ID or by Tags.',
            widget: {
                type: 'options',
                items: ['fullwidth', 'block', 'inline'],
                oneline: true,
            }
        }
    }
};
export class Fieldgroup {
    constructor(conf, cms) {
        this.tags = [];
        this.isFieldable = true;
        conf = typeof conf === 'string' ? cms.fieldgroups[conf] : conf;
        this.id = conf.id;
        this.admin = conf.admin;
        if (conf.tags)
            this.tags = typeof conf.tags === 'string' ? conf.tags.split(/[\s,]+/) : conf.tags;
        this.displays = { default: 'div', ...cms.parseEntityDisplayConfigSetting(conf.displays) };
        this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id, conf]) => {
            return [id, new Field(id, conf, cms)];
        }));
    }
}
export default Fieldgroup;
