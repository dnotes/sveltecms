import { SvelteComponentTyped } from "svelte";
import type { CMSWidgetField } from "..";
declare const __propDef: {
    props: {
        field: CMSWidgetField;
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
export declare type CmsWidgetDateProps = typeof __propDef.props;
export declare type CmsWidgetDateEvents = typeof __propDef.events;
export declare type CmsWidgetDateSlots = typeof __propDef.slots;
export default class CmsWidgetDate extends SvelteComponentTyped<CmsWidgetDateProps, CmsWidgetDateEvents, CmsWidgetDateSlots> {
}
export {};
