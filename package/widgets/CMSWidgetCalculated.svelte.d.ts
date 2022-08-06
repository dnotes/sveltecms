import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetCalculatedProps = typeof __propDef.props;
export declare type CmsWidgetCalculatedEvents = typeof __propDef.events;
export declare type CmsWidgetCalculatedSlots = typeof __propDef.slots;
export default class CmsWidgetCalculated extends SvelteComponentTyped<CmsWidgetCalculatedProps, CmsWidgetCalculatedEvents, CmsWidgetCalculatedSlots> {
}
export {};
