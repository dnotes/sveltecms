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
export declare type CmsConfigViewProps = typeof __propDef.props;
export declare type CmsConfigViewEvents = typeof __propDef.events;
export declare type CmsConfigViewSlots = typeof __propDef.slots;
export default class CmsConfigView extends SvelteComponentTyped<CmsConfigViewProps, CmsConfigViewEvents, CmsConfigViewSlots> {
}
export {};
