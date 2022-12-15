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
export type CmsWidgetCheckboxProps = typeof __propDef.props;
export type CmsWidgetCheckboxEvents = typeof __propDef.events;
export type CmsWidgetCheckboxSlots = typeof __propDef.slots;
export default class CmsWidgetCheckbox extends SvelteComponentTyped<CmsWidgetCheckboxProps, CmsWidgetCheckboxEvents, CmsWidgetCheckboxSlots> {
}
export {};
