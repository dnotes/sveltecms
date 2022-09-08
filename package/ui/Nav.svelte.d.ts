import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: string;
        basePath: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type NavProps = typeof __propDef.props;
export declare type NavEvents = typeof __propDef.events;
export declare type NavSlots = typeof __propDef.slots;
export default class Nav extends SvelteComponentTyped<NavProps, NavEvents, NavSlots> {
}
export {};
