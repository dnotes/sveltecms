import Field, {} from "./Field";
export class Collection {
    constructor(conf, cms) {
        this.isFieldable = true;
        this.id = conf.id;
        this.admin = conf.admin;
        this.fields = Object.fromEntries(Object.entries(conf.fields).map(([id, conf]) => {
            return [id, new Field(id, conf, cms)];
        }));
    }
}
export const collectionTypes = [
    {
        id: 'base',
        fields: {},
    },
];
export default Collection;
