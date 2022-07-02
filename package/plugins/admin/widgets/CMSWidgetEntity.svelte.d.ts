import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { EntityConfigSetting, WidgetField } from "sveltecms";
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
        };
        entityID?: string | null;
        collapsed?: boolean;
        nested?: boolean;
        idElement?: HTMLElement;
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
export declare type CmsWidgetEntityProps = typeof __propDef.props;
export declare type CmsWidgetEntityEvents = typeof __propDef.events;
export declare type CmsWidgetEntitySlots = typeof __propDef.slots;
export default class CmsWidgetEntity extends SvelteComponentTyped<CmsWidgetEntityProps, CmsWidgetEntityEvents, CmsWidgetEntitySlots> {
}
export {};
