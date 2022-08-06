import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type Field from "sveltecms/core/Field";
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
export declare type DateProps = typeof __propDef.props;
export declare type DateEvents = typeof __propDef.events;
export declare type DateSlots = typeof __propDef.slots;
export default class Date extends SvelteComponentTyped<DateProps, DateEvents, DateSlots> {
}
export {};
