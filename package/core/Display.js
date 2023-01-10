import Image from "../display/field/Image.svelte";
import File from "../display/field/File.svelte";
import Fieldgroup from "../display/field/Fieldgroup.svelte";
import Reference from "../display/field/Reference.svelte";
import DateSvelte from "../display/field/Date.svelte";
export function isDisplayConfig(item) {
    return item?.type !== undefined;
}
export const defaultDisplayModes = ['default', 'page', 'teaser', 'reference'];
export const displayNoneKeywords = ['none', 'hidden', 'false'];
export function isDisplayNone(conf) { return (!conf || displayNoneKeywords.includes(conf)) ? true : false; }
export const templateDisplay = {
    id: 'display',
    label: 'Display',
    labelPlural: 'Displays',
    description: 'A Display configuration is part of the configuraiton for a Field, Fieldgroup, or ContentType '
        + 'which determines how it will be displayed by SvelteCMS.',
    typeField: true,
    listFields: ['wrapper', 'label', 'html', 'link'],
    configFields: {
        type: {
            type: 'text',
            default: '',
            helptext: 'An HTML element (p, li, etc.) or ID of a registered SvelteCMS Component to use when displaying the field.',
        },
        wrapper: {
            type: 'text',
            default: '',
            helptext: 'An HTML element (div, ul, etc.) or ID of a registered SvelteCMS Component to use as a wrapper for the displayed field.',
        },
        label: {
            type: 'text',
            default: '',
            helptext: 'An HTML element (div, span.label, etc.) or ID of a registered SvelteCMS Component to use when displaying the Field label.',
        },
        html: {
            type: 'boolean',
            default: false,
            helptext: `Whether to treat the field value as pre-sanitized HTML. ` +
                `NOTE! Unless the user input for the field is sanitized with ` +
                `an appropriate and properly configured preMount Transformer, ` +
                `using this feature is a critical security vulnerability.`
        },
        link: {
            type: 'boolean',
            default: false,
            helptext: `Whether to display the field value as a link to its parent Content.`
        },
    }
};
export class Display {
    constructor(conf, cms) {
        this.type = '';
        this.isDisplayed = false;
        this.link = false;
        if (!conf || isDisplayNone(conf))
            return;
        conf = typeof conf === 'string' ? { type: conf } : conf;
        if (isDisplayNone(conf.type))
            return;
        this.isDisplayed = true;
        this.type = conf.type.trim();
        this.component = cms.getEntity('component', this.type);
        this.link = conf.link ? true : false;
        if (!this.component) {
            this.html = conf?.html;
            let el, classes, tag, id;
            [el, ...classes] = this.type.split('.');
            this.classes = classes;
            [tag, id] = el.split('#');
            this.tag = tag;
            this.id = id;
        }
        if (conf.wrapper)
            this.wrapper = new Display(conf.wrapper, cms);
        if (conf.label)
            this.label = new Display(conf.label, cms);
    }
    get classList() { return this.classes.join(' '); }
}
export const displayComponents = [
    { id: 'sveltecms/display/field/Date', component: DateSvelte, admin: true },
    { id: 'sveltecms/display/field/Image', component: Image, admin: true },
    { id: 'sveltecms/display/field/File', component: File, admin: true },
    { id: 'sveltecms/display/field/Fieldgroup', component: Fieldgroup, admin: true },
    { id: 'sveltecms/display/field/Reference', component: Reference, admin: true },
];
export default Display;
