import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "..";
import type { Content, Value } from "../core/ContentStore";
import type ContentType from "../core/ContentType";
import type { Display } from "../core/Display";
import type Field from "../core/Field";
import type Fieldgroup from "./field/Fieldgroup.svelte";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: ContentType | Field | Fieldgroup;
        item?: Content | Value | undefined;
        parent?: Content | Value | undefined;
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
export type WrapperProps = typeof __propDef.props;
export type WrapperEvents = typeof __propDef.events;
export type WrapperSlots = typeof __propDef.slots;
export default class Wrapper extends SvelteComponentTyped<WrapperProps, WrapperEvents, WrapperSlots> {
}
export {};
