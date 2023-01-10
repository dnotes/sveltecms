import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from '../../..';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CheckboxTextProps = typeof __propDef.props;
export type CheckboxTextEvents = typeof __propDef.events;
export type CheckboxTextSlots = typeof __propDef.slots;
export default class CheckboxText extends SvelteComponentTyped<CheckboxTextProps, CheckboxTextEvents, CheckboxTextSlots> {
}
export {};
