import { SvelteComponentTyped } from "svelte";
import type { EntityTemplate } from "sveltecms/core/EntityTemplate";
declare const __propDef: {
    props: {
        entityType: EntityTemplate;
        items?: string[];
        value: string;
        id: string;
        required?: boolean;
    };
    events: {
        change: Event;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetEntityTypeFieldProps = typeof __propDef.props;
export declare type CmsWidgetEntityTypeFieldEvents = typeof __propDef.events;
export declare type CmsWidgetEntityTypeFieldSlots = typeof __propDef.slots;
export default class CmsWidgetEntityTypeField extends SvelteComponentTyped<CmsWidgetEntityTypeFieldProps, CmsWidgetEntityTypeFieldEvents, CmsWidgetEntityTypeFieldSlots> {
}
export {};
