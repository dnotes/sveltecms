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
export declare type CmsWidgetSelectProps = typeof __propDef.props;
export declare type CmsWidgetSelectEvents = typeof __propDef.events;
export declare type CmsWidgetSelectSlots = typeof __propDef.slots;
export default class CmsWidgetSelect extends SvelteComponentTyped<CmsWidgetSelectProps, CmsWidgetSelectEvents, CmsWidgetSelectSlots> {
}
export {};
