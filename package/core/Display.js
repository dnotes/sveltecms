import Content from "sveltecms/display/Content.svelte";
import Field from "sveltecms/display/Content.svelte";
import Image from "sveltecms/display/field/Image.svelte";
import File from "sveltecms/display/field/File.svelte";
import Element from "sveltecms/display/field/Element.svelte";
import Fieldgroup from "sveltecms/display/field/Fieldgroup.svelte";
export const templateDisplay = {
    id: 'display',
    label: 'Display',
    labelPlural: 'Displays',
    typeField: true,
    configFields: {
        type: {
            type: 'text',
            default: '',
            helptext: 'An HTML element (p, li, etc.) or registered component to use when displaying the field.',
        },
        wrapper: {
            type: 'text',
            default: '',
            helptext: 'An HTML element (div, ul, etc.) or registered component to use as a wrapper for the displayed field.',
        },
        html: {
            type: 'boolean',
            default: false,
            helptext: `Whether to treat the field value as pre-sanitized HTML. ` +
                `NOTE! Unless the user input for the field is sanitized with ` +
                `an appropriate and properly configured preMount transformer, ` +
                `using this feature is a critical security vulnerability.`
        }
    }
};
export class DisplayConfig {
    constructor(conf, cms) {
        this.type = '';
        this.isComponent = false;
        if (!conf)
            return;
        conf = typeof conf === 'string' ? { type: conf } : conf;
        this.type = conf.type;
        this.isComponent = cms.components[this.type] ? true : false;
        this.html = conf?.html;
        if (conf.wrapper)
            this.wrapper = new DisplayConfig(conf.wrapper, cms);
    }
}
export const displayComponents = [
    { id: 'content', component: Content },
    { id: 'field', component: Field },
    { id: 'field_element', component: Element },
    { id: 'field_image', component: Image },
    { id: 'field_file', component: File },
    { id: 'field_fieldgroup', component: Fieldgroup },
];
