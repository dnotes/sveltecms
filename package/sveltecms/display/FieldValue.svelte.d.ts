import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type { Content, Value } from "../../core/ContentStore";
import type { Field } from "../../core/Field";
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
export type FieldValueProps = typeof __propDef.props;
export type FieldValueEvents = typeof __propDef.events;
export type FieldValueSlots = typeof __propDef.slots;
export default class FieldValue extends SvelteComponentTyped<FieldValueProps, FieldValueEvents, FieldValueSlots> {
}
export {};
