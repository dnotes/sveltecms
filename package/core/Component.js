export const templateComponent = {
    id: 'component',
    label: 'Component',
    labelPlural: 'Components',
    typeField: true,
    typeInherits: true,
    typeRestricted: true,
    isConfigurable: true,
};
export class Component {
    constructor(conf, cms) {
        let componentType = typeof conf === 'string' ? cms.components[conf] : (cms.components[conf?.type] || cms.components[conf?.id]);
        if (!componentType)
            throw new Error(`Component type not found for ${conf?.['id'] || conf?.['type'] || conf}`);
        this.id = componentType.id;
        this.type = componentType.id;
        this.component = componentType.component;
        this.options = cms.getInstanceOptions(componentType, conf);
    }
}
export default Component;
