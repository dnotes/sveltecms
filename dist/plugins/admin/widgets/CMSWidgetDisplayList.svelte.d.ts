import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "../../..";
import type SvelteCMS from "../../..";
import { type EntityDisplayConfigSetting, type FullEntityDisplayConfig } from "../../../core/Display";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field?: WidgetField;
        id: string;
        value: EntityDisplayConfigSetting;
        options: {
            displayDefaults: FullEntityDisplayConfig;
            required?: boolean;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetDisplayListProps = typeof __propDef.props;
export type CmsWidgetDisplayListEvents = typeof __propDef.events;
export type CmsWidgetDisplayListSlots = typeof __propDef.slots;
export default class CmsWidgetDisplayList extends SvelteComponentTyped<CmsWidgetDisplayListProps, CmsWidgetDisplayListEvents, CmsWidgetDisplayListSlots> {
}
export {};
