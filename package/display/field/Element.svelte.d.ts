import { SvelteComponentTyped } from "svelte";
import type { Field, FieldConfigSetting } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        field: Field | FieldConfigSetting;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ElementProps = typeof __propDef.props;
export declare type ElementEvents = typeof __propDef.events;
export declare type ElementSlots = typeof __propDef.slots;
export default class Element extends SvelteComponentTyped<ElementProps, ElementEvents, ElementSlots> {
}
export {};
