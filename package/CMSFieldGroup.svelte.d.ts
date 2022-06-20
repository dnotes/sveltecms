import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
import type { FieldableEntity } from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        values?: {};
        errors?: {};
        touched?: {};
        id?: string;
        fieldgroup?: FieldableEntity;
        widgetFieldGroup?: import("sveltecms").WidgetFieldFieldgroup;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsFieldGroupProps = typeof __propDef.props;
export declare type CmsFieldGroupEvents = typeof __propDef.events;
export declare type CmsFieldGroupSlots = typeof __propDef.slots;
export default class CmsFieldGroup extends SvelteComponentTyped<CmsFieldGroupProps, CmsFieldGroupEvents, CmsFieldGroupSlots> {
}
export {};
