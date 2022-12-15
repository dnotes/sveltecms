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
export type CmsConfigContentTypeListProps = typeof __propDef.props;
export type CmsConfigContentTypeListEvents = typeof __propDef.events;
export type CmsConfigContentTypeListSlots = typeof __propDef.slots;
export default class CmsConfigContentTypeList extends SvelteComponentTyped<CmsConfigContentTypeListProps, CmsConfigContentTypeListEvents, CmsConfigContentTypeListSlots> {
}
export {};
