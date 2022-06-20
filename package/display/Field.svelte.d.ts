import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { Field } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: Field;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FieldProps = typeof __propDef.props;
export declare type FieldEvents = typeof __propDef.events;
export declare type FieldSlots = typeof __propDef.slots;
export default class Field extends SvelteComponentTyped<FieldProps, FieldEvents, FieldSlots> {
}
export {};
