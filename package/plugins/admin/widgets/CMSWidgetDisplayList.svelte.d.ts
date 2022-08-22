import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "sveltecms";
import type SvelteCMS from "sveltecms";
import { type EntityDisplayConfigSetting } from "sveltecms/core/Display";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value: EntityDisplayConfigSetting;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetDisplayListProps = typeof __propDef.props;
export declare type CmsWidgetDisplayListEvents = typeof __propDef.events;
export declare type CmsWidgetDisplayListSlots = typeof __propDef.slots;
export default class CmsWidgetDisplayList extends SvelteComponentTyped<CmsWidgetDisplayListProps, CmsWidgetDisplayListEvents, CmsWidgetDisplayListSlots> {
}
export {};
