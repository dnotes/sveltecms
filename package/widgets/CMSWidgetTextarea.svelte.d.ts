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
export type CmsWidgetTextareaProps = typeof __propDef.props;
export type CmsWidgetTextareaEvents = typeof __propDef.events;
export type CmsWidgetTextareaSlots = typeof __propDef.slots;
export default class CmsWidgetTextarea extends SvelteComponentTyped<CmsWidgetTextareaProps, CmsWidgetTextareaEvents, CmsWidgetTextareaSlots> {
}
export {};
