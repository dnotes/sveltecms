import { SvelteComponentTyped } from "svelte";
import type { CMSWidgetField } from "..";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        field: CMSWidgetField;
        id: string;
        cms: SvelteCMS;
        contentTypeID: string;
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
