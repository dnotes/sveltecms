import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type Field from "../../core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: string | Date;
        displayMode: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type DateProps = typeof __propDef.props;
export type DateEvents = typeof __propDef.events;
export type DateSlots = typeof __propDef.slots;
export default class Date extends SvelteComponentTyped<DateProps, DateEvents, DateSlots> {
}
export {};
