import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { DisplayConfig } from "sveltecms/core/Display";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        display: DisplayConfig;
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
