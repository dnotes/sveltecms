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
export declare type CmsWidgetTextareaProps = typeof __propDef.props;
export declare type CmsWidgetTextareaEvents = typeof __propDef.events;
export declare type CmsWidgetTextareaSlots = typeof __propDef.slots;
export default class CmsWidgetTextarea extends SvelteComponentTyped<CmsWidgetTextareaProps, CmsWidgetTextareaEvents, CmsWidgetTextareaSlots> {
}
export {};
