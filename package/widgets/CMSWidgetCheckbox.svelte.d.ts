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
export declare type CmsWidgetCheckboxProps = typeof __propDef.props;
export declare type CmsWidgetCheckboxEvents = typeof __propDef.events;
export declare type CmsWidgetCheckboxSlots = typeof __propDef.slots;
export default class CmsWidgetCheckbox extends SvelteComponentTyped<CmsWidgetCheckboxProps, CmsWidgetCheckboxEvents, CmsWidgetCheckboxSlots> {
}
export {};
