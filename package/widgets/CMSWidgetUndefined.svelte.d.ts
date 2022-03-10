import { SvelteComponentTyped } from "svelte";
import type { CMSWidgetField } from "..";
declare const __propDef: {
    props: {
        field: CMSWidgetField;
        id: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetUndefinedProps = typeof __propDef.props;
export declare type CmsWidgetUndefinedEvents = typeof __propDef.events;
export declare type CmsWidgetUndefinedSlots = typeof __propDef.slots;
export default class CmsWidgetUndefined extends SvelteComponentTyped<CmsWidgetUndefinedProps, CmsWidgetUndefinedEvents, CmsWidgetUndefinedSlots> {
}
export {};
