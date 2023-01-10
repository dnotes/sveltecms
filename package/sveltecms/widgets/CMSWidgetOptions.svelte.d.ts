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
export type CmsWidgetOptionsProps = typeof __propDef.props;
export type CmsWidgetOptionsEvents = typeof __propDef.events;
export type CmsWidgetOptionsSlots = typeof __propDef.slots;
export default class CmsWidgetOptions extends SvelteComponentTyped<CmsWidgetOptionsProps, CmsWidgetOptionsEvents, CmsWidgetOptionsSlots> {
}
export {};
