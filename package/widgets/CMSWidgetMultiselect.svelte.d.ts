import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: string | number | Array<string | number>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetMultiselectProps = typeof __propDef.props;
export declare type CmsWidgetMultiselectEvents = typeof __propDef.events;
export declare type CmsWidgetMultiselectSlots = typeof __propDef.slots;
export default class CmsWidgetMultiselect extends SvelteComponentTyped<CmsWidgetMultiselectProps, CmsWidgetMultiselectEvents, CmsWidgetMultiselectSlots> {
}
export {};
