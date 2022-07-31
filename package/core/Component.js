/**
 * Note: Components must be pre-registered for ANY type of import in SvelteKit.
 * Dynamic import() cannot be used with a variable in the import string; this
 * is a limitation of the bundler. See https://github.com/sveltejs/svelte/issues/6702.
 */
export const templateComponent = {
    id: 'component',
    label: 'Component',
    labelPlural: 'Components',
    description: `Components are .svelte files used to display content. Some are provided by plugins, but they can also be created by developers for a particular app or website.`,
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
        this.admin = componentType?.admin;
        this.options = cms.getInstanceOptions(componentType, conf);
    }
}
export default Component;
