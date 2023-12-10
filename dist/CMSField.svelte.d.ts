import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from './';
import type { WidgetField } from './';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        id: string;
        field: WidgetField;
        value: any;
        class?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsFieldProps = typeof __propDef.props;
export type CmsFieldEvents = typeof __propDef.events;
export type CmsFieldSlots = typeof __propDef.slots;
export default class CmsField extends SvelteComponentTyped<CmsFieldProps, CmsFieldEvents, CmsFieldSlots> {
}
export {};
