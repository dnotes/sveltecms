import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from './';
import type { FieldableEntity } from './';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        values?: {};
        errors?: {};
        touched?: {};
        id?: string;
        fieldgroup?: FieldableEntity;
        widgetFieldGroup?: import("./").WidgetFieldFieldgroup;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsFieldGroupProps = typeof __propDef.props;
export type CmsFieldGroupEvents = typeof __propDef.events;
export type CmsFieldGroupSlots = typeof __propDef.slots;
export default class CmsFieldGroup extends SvelteComponentTyped<CmsFieldGroupProps, CmsFieldGroupEvents, CmsFieldGroupSlots> {
}
export {};
