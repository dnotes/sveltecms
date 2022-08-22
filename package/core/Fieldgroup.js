import Field, {} from "./Field";
export const templateFieldgroup = {
    id: 'fieldgroup',
    label: 'Field Group',
    labelPlural: 'Field Groups',
    description: `A Field Group is a group of Fields.`,
    typeField: true,
    typeInherits: true,
    isConfigurable: true,
    isDisplayable: true,
    isFieldable: true,
};
export class Fieldgroup {
    constructor(conf, cms) {
        this.isFieldable = true;
        conf = typeof conf === 'string' ? cms.fieldgroups[conf] : conf;
        this.id = conf.id;
        this.admin = conf.admin;
        this.type = conf.type || conf.id;
        this.displays = { default: 'div', ...cms.parseEntityDisplayConfigSetting(conf.displays) };
        this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id, conf]) => {
            return [id, new Field(id, conf, cms)];
        }));
    }
}
export default Fieldgroup;
