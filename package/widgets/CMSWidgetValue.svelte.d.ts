import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetValueProps = typeof __propDef.props;
export declare type CmsWidgetValueEvents = typeof __propDef.events;
export declare type CmsWidgetValueSlots = typeof __propDef.slots;
export default class CmsWidgetValue extends SvelteComponentTyped<CmsWidgetValueProps, CmsWidgetValueEvents, CmsWidgetValueSlots> {
}
export {};
