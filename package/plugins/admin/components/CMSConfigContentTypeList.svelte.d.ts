import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        basePath: string;
        adminPath: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigContentTypeListProps = typeof __propDef.props;
export declare type CmsConfigContentTypeListEvents = typeof __propDef.events;
export declare type CmsConfigContentTypeListSlots = typeof __propDef.slots;
export default class CmsConfigContentTypeList extends SvelteComponentTyped<CmsConfigContentTypeListProps, CmsConfigContentTypeListEvents, CmsConfigContentTypeListSlots> {
}
export {};
