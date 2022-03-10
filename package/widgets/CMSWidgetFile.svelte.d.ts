import { SvelteComponentTyped } from "svelte";
import type { CMSWidgetField } from "..";
declare const __propDef: {
    props: {
        field: CMSWidgetField;
        id: string;
        value?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetFileProps = typeof __propDef.props;
export declare type CmsWidgetFileEvents = typeof __propDef.events;
export declare type CmsWidgetFileSlots = typeof __propDef.slots;
export default class CmsWidgetFile extends SvelteComponentTyped<CmsWidgetFileProps, CmsWidgetFileEvents, CmsWidgetFileSlots> {
}
export {};
