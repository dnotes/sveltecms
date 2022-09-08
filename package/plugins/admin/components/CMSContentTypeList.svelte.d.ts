import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
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
export declare type CmsContentTypeListProps = typeof __propDef.props;
export declare type CmsContentTypeListEvents = typeof __propDef.events;
export declare type CmsContentTypeListSlots = typeof __propDef.slots;
export default class CmsContentTypeList extends SvelteComponentTyped<CmsContentTypeListProps, CmsContentTypeListEvents, CmsContentTypeListSlots> {
}
export {};
