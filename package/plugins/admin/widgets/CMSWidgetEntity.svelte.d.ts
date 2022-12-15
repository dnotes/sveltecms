import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
import type { EntityConfigSetting, WidgetField } from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        id: string;
        value: string | EntityConfigSetting;
        field?: WidgetField;
        options?: {
            entityType: string;
            fieldType?: string;
            skipDetail?: boolean;
            isTopLevelEntity?: boolean;
            placeholder?: string;
        };
        entityID?: string | null;
        nested?: boolean;
        idElement?: HTMLElement;
        label?: string;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetEntityProps = typeof __propDef.props;
export type CmsWidgetEntityEvents = typeof __propDef.events;
export type CmsWidgetEntitySlots = typeof __propDef.slots;
export default class CmsWidgetEntity extends SvelteComponentTyped<CmsWidgetEntityProps, CmsWidgetEntityEvents, CmsWidgetEntitySlots> {
}
export {};
