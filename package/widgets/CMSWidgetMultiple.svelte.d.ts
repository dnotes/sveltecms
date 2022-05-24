import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        cms: SvelteCMS;
        value?: any[];
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetMultipleProps = typeof __propDef.props;
export declare type CmsWidgetMultipleEvents = typeof __propDef.events;
export declare type CmsWidgetMultipleSlots = typeof __propDef.slots;
export default class CmsWidgetMultiple extends SvelteComponentTyped<CmsWidgetMultipleProps, CmsWidgetMultipleEvents, CmsWidgetMultipleSlots> {
}
export {};
