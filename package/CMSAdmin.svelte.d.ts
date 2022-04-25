import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsAdminProps = typeof __propDef.props;
export declare type CmsAdminEvents = typeof __propDef.events;
export declare type CmsAdminSlots = typeof __propDef.slots;
export default class CmsAdmin extends SvelteComponentTyped<CmsAdminProps, CmsAdminEvents, CmsAdminSlots> {
}
export {};
