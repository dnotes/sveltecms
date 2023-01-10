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
export type CmsWidgetNumberProps = typeof __propDef.props;
export type CmsWidgetNumberEvents = typeof __propDef.events;
export type CmsWidgetNumberSlots = typeof __propDef.slots;
export default class CmsWidgetNumber extends SvelteComponentTyped<CmsWidgetNumberProps, CmsWidgetNumberEvents, CmsWidgetNumberSlots> {
}
export {};
