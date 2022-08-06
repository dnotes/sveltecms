import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { Content, Value } from "sveltecms/core/ContentStore";
import type ContentType from "sveltecms/core/ContentType";
import type { Display } from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";
import type Fieldgroup from "./field/Fieldgroup.svelte";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: ContentType | Field | Fieldgroup;
        item: Content | Value;
        parent: Content | Value;
        displayMode: string;
        display: Display;
        class?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type WrapperProps = typeof __propDef.props;
export declare type WrapperEvents = typeof __propDef.events;
export declare type WrapperSlots = typeof __propDef.slots;
export default class Wrapper extends SvelteComponentTyped<WrapperProps, WrapperEvents, WrapperSlots> {
}
export {};
