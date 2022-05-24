import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
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
