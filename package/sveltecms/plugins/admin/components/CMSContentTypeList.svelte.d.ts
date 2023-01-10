import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../../..";
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
export type CmsContentTypeListProps = typeof __propDef.props;
export type CmsContentTypeListEvents = typeof __propDef.events;
export type CmsContentTypeListSlots = typeof __propDef.slots;
export default class CmsContentTypeList extends SvelteComponentTyped<CmsContentTypeListProps, CmsContentTypeListEvents, CmsContentTypeListSlots> {
}
export {};
