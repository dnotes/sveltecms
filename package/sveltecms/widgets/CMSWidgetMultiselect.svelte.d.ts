import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from '../..';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: string | number | Array<string | number>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetMultiselectProps = typeof __propDef.props;
export type CmsWidgetMultiselectEvents = typeof __propDef.events;
export type CmsWidgetMultiselectSlots = typeof __propDef.slots;
export default class CmsWidgetMultiselect extends SvelteComponentTyped<CmsWidgetMultiselectProps, CmsWidgetMultiselectEvents, CmsWidgetMultiselectSlots> {
}
export {};
