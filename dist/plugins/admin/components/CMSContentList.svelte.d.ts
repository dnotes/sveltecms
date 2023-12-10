import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
declare const __propDef: {
    props: {
        adminPath: string;
        basePath: string;
        data?: any[];
        cms: SvelteCMS;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsContentListProps = typeof __propDef.props;
export type CmsContentListEvents = typeof __propDef.events;
export type CmsContentListSlots = typeof __propDef.slots;
export default class CmsContentList extends SvelteComponentTyped<CmsContentListProps, CmsContentListEvents, CmsContentListSlots> {
}
export {};
