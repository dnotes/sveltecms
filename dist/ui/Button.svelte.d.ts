import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        submit?: boolean;
        disabled?: boolean;
        small?: boolean;
        borderless?: boolean;
        highlight?: boolean;
        primary?: boolean;
        danger?: boolean;
        helptext?: string;
        type?: "" | "cancel" | "configure" | "fn";
        formaction?: string;
        href?: string;
        text?: string;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type ButtonProps = typeof __propDef.props;
export type ButtonEvents = typeof __propDef.events;
export type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
