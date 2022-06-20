import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "sveltecms";
import type SvelteCMS from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id?: string;
        cms: SvelteCMS;
        value?: {};
        collapsed?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetFieldgroupProps = typeof __propDef.props;
export declare type CmsWidgetFieldgroupEvents = typeof __propDef.events;
export declare type CmsWidgetFieldgroupSlots = typeof __propDef.slots;
export default class CmsWidgetFieldgroup extends SvelteComponentTyped<CmsWidgetFieldgroupProps, CmsWidgetFieldgroupEvents, CmsWidgetFieldgroupSlots> {
}
export {};
