import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from '..';
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
export type CmsWidgetValueProps = typeof __propDef.props;
export type CmsWidgetValueEvents = typeof __propDef.events;
export type CmsWidgetValueSlots = typeof __propDef.slots;
export default class CmsWidgetValue extends SvelteComponentTyped<CmsWidgetValueProps, CmsWidgetValueEvents, CmsWidgetValueSlots> {
}
export {};
