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
export declare type CmsWidgetCheckboxProps = typeof __propDef.props;
export declare type CmsWidgetCheckboxEvents = typeof __propDef.events;
export declare type CmsWidgetCheckboxSlots = typeof __propDef.slots;
export default class CmsWidgetCheckbox extends SvelteComponentTyped<CmsWidgetCheckboxProps, CmsWidgetCheckboxEvents, CmsWidgetCheckboxSlots> {
}
export {};
