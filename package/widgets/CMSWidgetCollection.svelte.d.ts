import { SvelteComponentTyped } from "svelte";
import type { CMSWidgetField } from "..";
import type SvelteCMS from '..';
declare const __propDef: {
    props: {
        field: CMSWidgetField;
        id?: string;
        cms: SvelteCMS;
        contentTypeID: string;
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
