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
export type CmsWidgetSelectProps = typeof __propDef.props;
export type CmsWidgetSelectEvents = typeof __propDef.events;
export type CmsWidgetSelectSlots = typeof __propDef.slots;
export default class CmsWidgetSelect extends SvelteComponentTyped<CmsWidgetSelectProps, CmsWidgetSelectEvents, CmsWidgetSelectSlots> {
}
export {};
