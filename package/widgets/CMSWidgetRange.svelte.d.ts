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
export declare type CmsWidgetRangeProps = typeof __propDef.props;
export declare type CmsWidgetRangeEvents = typeof __propDef.events;
export declare type CmsWidgetRangeSlots = typeof __propDef.slots;
export default class CmsWidgetRange extends SvelteComponentTyped<CmsWidgetRangeProps, CmsWidgetRangeEvents, CmsWidgetRangeSlots> {
}
export {};
