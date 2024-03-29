import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetRangeProps = typeof __propDef.props;
export type CmsWidgetRangeEvents = typeof __propDef.events;
export type CmsWidgetRangeSlots = typeof __propDef.slots;
export default class CmsWidgetRange extends SvelteComponentTyped<CmsWidgetRangeProps, CmsWidgetRangeEvents, CmsWidgetRangeSlots> {
}
export {};
