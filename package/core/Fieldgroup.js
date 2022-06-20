import { Entity } from "./EntityTemplate";
import Field, {} from "./Field";
export const templateFieldgroup = {
    id: 'fieldgroup',
    label: 'Field Group',
    labelPlural: 'Field Groups',
    typeField: true,
    typeInherits: true,
    isConfigurable: true,
    isFieldable: true,
};
export class Fieldgroup extends Entity {
    constructor(conf, cms) {
        super(templateFieldgroup);
        this.template = templateFieldgroup;
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
