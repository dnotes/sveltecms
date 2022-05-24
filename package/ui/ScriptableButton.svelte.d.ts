import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        value: any;
        default: any;
        label: string;
        isScript: any;
        scriptValue?: string;
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
export declare type ScriptableButtonProps = typeof __propDef.props;
export declare type ScriptableButtonEvents = typeof __propDef.events;
export declare type ScriptableButtonSlots = typeof __propDef.slots;
export default class ScriptableButton extends SvelteComponentTyped<ScriptableButtonProps, ScriptableButtonEvents, ScriptableButtonSlots> {
}
export {};
