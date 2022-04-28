import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { AdminPath } from "..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: AdminPath;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigProps = typeof __propDef.props;
export declare type CmsConfigEvents = typeof __propDef.events;
export declare type CmsConfigSlots = typeof __propDef.slots;
export default class CmsConfig extends SvelteComponentTyped<CmsConfigProps, CmsConfigEvents, CmsConfigSlots> {
}
export {};
