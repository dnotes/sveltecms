import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '..';
import type { WidgetField } from '..';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        value: any;
        field: WidgetField;
        isScript?: boolean;
        scriptValue?: string;
        overridden?: boolean;
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
export type ScriptableButtonProps = typeof __propDef.props;
export type ScriptableButtonEvents = typeof __propDef.events;
export type ScriptableButtonSlots = typeof __propDef.slots;
export default class ScriptableButton extends SvelteComponentTyped<ScriptableButtonProps, ScriptableButtonEvents, ScriptableButtonSlots> {
}
export {};
