import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: string;
        basePath: string;
        data?: any[];
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsContentListProps = typeof __propDef.props;
export declare type CmsContentListEvents = typeof __propDef.events;
export declare type CmsContentListSlots = typeof __propDef.slots;
export default class CmsContentList extends SvelteComponentTyped<CmsContentListProps, CmsContentListEvents, CmsContentListSlots> {
}
export {};
