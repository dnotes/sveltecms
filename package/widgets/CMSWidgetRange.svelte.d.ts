import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
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
export declare type CmsWidgetRangeProps = typeof __propDef.props;
export declare type CmsWidgetRangeEvents = typeof __propDef.events;
export declare type CmsWidgetRangeSlots = typeof __propDef.slots;
export default class CmsWidgetRange extends SvelteComponentTyped<CmsWidgetRangeProps, CmsWidgetRangeEvents, CmsWidgetRangeSlots> {
}
export {};
