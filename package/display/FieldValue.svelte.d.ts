import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { Content, Value } from "sveltecms/core/ContentStore";
import type { Field } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: Value;
        parent: Content;
        displayMode?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FieldValueProps = typeof __propDef.props;
export declare type FieldValueEvents = typeof __propDef.events;
export declare type FieldValueSlots = typeof __propDef.slots;
export default class FieldValue extends SvelteComponentTyped<FieldValueProps, FieldValueEvents, FieldValueSlots> {
}
export {};
