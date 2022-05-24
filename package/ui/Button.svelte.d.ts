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
        href?: string;
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
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
