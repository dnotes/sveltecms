import { SvelteComponentTyped } from "svelte";
import type { EntityTemplate } from "../../../core/EntityTemplate";
declare const __propDef: {
    props: {
        entityType: EntityTemplate;
        items?: string[];
        value: string;
        id: string;
        required?: boolean;
        unset?: string;
        placeholder?: string;
    };
    events: {
        change: Event;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetEntityTypeFieldProps = typeof __propDef.props;
export type CmsWidgetEntityTypeFieldEvents = typeof __propDef.events;
export type CmsWidgetEntityTypeFieldSlots = typeof __propDef.slots;
export default class CmsWidgetEntityTypeField extends SvelteComponentTyped<CmsWidgetEntityTypeFieldProps, CmsWidgetEntityTypeFieldEvents, CmsWidgetEntityTypeFieldSlots> {
}
export {};
