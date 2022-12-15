import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: string | Date | number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetDateProps = typeof __propDef.props;
export type CmsWidgetDateEvents = typeof __propDef.events;
export type CmsWidgetDateSlots = typeof __propDef.slots;
export default class CmsWidgetDate extends SvelteComponentTyped<CmsWidgetDateProps, CmsWidgetDateEvents, CmsWidgetDateSlots> {
}
export {};
