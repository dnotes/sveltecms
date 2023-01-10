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
export type CmsWidgetTextProps = typeof __propDef.props;
export type CmsWidgetTextEvents = typeof __propDef.events;
export type CmsWidgetTextSlots = typeof __propDef.slots;
export default class CmsWidgetText extends SvelteComponentTyped<CmsWidgetTextProps, CmsWidgetTextEvents, CmsWidgetTextSlots> {
}
export {};
