import { SvelteComponentTyped } from "svelte";
import type { ConfigSetting, WidgetField } from "../../..";
import type SvelteCMS from "../../..";
import { type EntityDisplayConfigSetting } from "../../../core/Display";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value: EntityDisplayConfigSetting;
        defaults: ConfigSetting;
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
