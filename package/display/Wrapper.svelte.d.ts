import { SvelteComponentTyped } from "svelte";
import type { Display } from "sveltecms/core/Display";
declare const __propDef: {
    props: {
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
