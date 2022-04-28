import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
import type { CMSWidgetField } from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        fieldList: {
            [id: string]: CMSWidgetField;
        };
        values: any;
        contentTypeID: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsFieldCollectionProps = typeof __propDef.props;
export declare type CmsFieldCollectionEvents = typeof __propDef.events;
export declare type CmsFieldCollectionSlots = typeof __propDef.slots;
export default class CmsFieldCollection extends SvelteComponentTyped<CmsFieldCollectionProps, CmsFieldCollectionEvents, CmsFieldCollectionSlots> {
}
export {};
