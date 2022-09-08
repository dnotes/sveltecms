import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "..";
import type { FieldableEntity } from "..";
import type { Value } from "../core/ContentStore";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: FieldableEntity;
        item: {
            [key: string]: Value;
        };
        displayMode: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FieldListProps = typeof __propDef.props;
export declare type FieldListEvents = typeof __propDef.events;
export declare type FieldListSlots = typeof __propDef.slots;
export default class FieldList extends SvelteComponentTyped<FieldListProps, FieldListEvents, FieldListSlots> {
}
export {};
