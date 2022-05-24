import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        id: string;
        field: WidgetField;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsFieldProps = typeof __propDef.props;
export declare type CmsFieldEvents = typeof __propDef.events;
export declare type CmsFieldSlots = typeof __propDef.slots;
export default class CmsField extends SvelteComponentTyped<CmsFieldProps, CmsFieldEvents, CmsFieldSlots> {
}
export {};
