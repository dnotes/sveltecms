import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '..';
import type { WidgetField } from '..';
import { type ScriptFunctionConfig } from '../core/ScriptFunction';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field?: WidgetField | {
            disabled?: boolean | ScriptFunctionConfig;
            id?: string;
        };
        id?: string;
        disabled?: boolean | ScriptFunctionConfig;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetScriptableProps = typeof __propDef.props;
export type CmsWidgetScriptableEvents = typeof __propDef.events;
export type CmsWidgetScriptableSlots = typeof __propDef.slots;
export default class CmsWidgetScriptable extends SvelteComponentTyped<CmsWidgetScriptableProps, CmsWidgetScriptableEvents, CmsWidgetScriptableSlots> {
}
export {};
