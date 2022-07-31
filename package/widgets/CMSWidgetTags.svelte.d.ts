import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetTagsProps = typeof __propDef.props;
export declare type CmsWidgetTagsEvents = typeof __propDef.events;
export declare type CmsWidgetTagsSlots = typeof __propDef.slots;
export default class CmsWidgetTags extends SvelteComponentTyped<CmsWidgetTagsProps, CmsWidgetTagsEvents, CmsWidgetTagsSlots> {
}
export {};
