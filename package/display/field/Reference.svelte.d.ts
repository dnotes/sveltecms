import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type { Content } from "../../core/ContentStore";
import type { Field } from "../../core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: Content;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ReferenceProps = typeof __propDef.props;
export declare type ReferenceEvents = typeof __propDef.events;
export declare type ReferenceSlots = typeof __propDef.slots;
export default class Reference extends SvelteComponentTyped<ReferenceProps, ReferenceEvents, ReferenceSlots> {
}
export {};
