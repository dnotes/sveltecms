import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "sveltecms";
import type SvelteCMS from 'sveltecms';
declare const __propDef: {
    props: {
        field: WidgetField;
        id?: string;
        cms: SvelteCMS;
        value?: {};
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetCollectionProps = typeof __propDef.props;
export declare type CmsWidgetCollectionEvents = typeof __propDef.events;
export declare type CmsWidgetCollectionSlots = typeof __propDef.slots;
export default class CmsWidgetCollection extends SvelteComponentTyped<CmsWidgetCollectionProps, CmsWidgetCollectionEvents, CmsWidgetCollectionSlots> {
}
export {};
