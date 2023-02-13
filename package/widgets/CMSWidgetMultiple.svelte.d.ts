import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        cms: SvelteCMS;
        value?: any | any[];
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetMultipleProps = typeof __propDef.props;
export type CmsWidgetMultipleEvents = typeof __propDef.events;
export type CmsWidgetMultipleSlots = typeof __propDef.slots;
export default class CmsWidgetMultiple extends SvelteComponentTyped<CmsWidgetMultipleProps, CmsWidgetMultipleEvents, CmsWidgetMultipleSlots> {
}
export {};
