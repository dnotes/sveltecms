import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        duration?: number;
        result?: any;
        fadeOptions?: {};
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        error: {};
        default: {};
    };
};
export type DisplayResultProps = typeof __propDef.props;
export type DisplayResultEvents = typeof __propDef.events;
export type DisplayResultSlots = typeof __propDef.slots;
export default class DisplayResult extends SvelteComponentTyped<DisplayResultProps, DisplayResultEvents, DisplayResultSlots> {
}
export {};
