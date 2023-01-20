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
        formaction?: string;
        href?: string;
        title: string;
        text?: string;
    };
    events: {
        confirm: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        confirm: {};
        text: {};
    };
};
export type ButtonConfirmProps = typeof __propDef.props;
export type ButtonConfirmEvents = typeof __propDef.events;
export type ButtonConfirmSlots = typeof __propDef.slots;
export default class ButtonConfirm extends SvelteComponentTyped<ButtonConfirmProps, ButtonConfirmEvents, ButtonConfirmSlots> {
}
export {};
