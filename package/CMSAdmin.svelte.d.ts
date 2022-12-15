import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "./";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: string;
        url: URL;
        data?: Object;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsAdminProps = typeof __propDef.props;
export type CmsAdminEvents = typeof __propDef.events;
export type CmsAdminSlots = typeof __propDef.slots;
export default class CmsAdmin extends SvelteComponentTyped<CmsAdminProps, CmsAdminEvents, CmsAdminSlots> {
}
export {};
