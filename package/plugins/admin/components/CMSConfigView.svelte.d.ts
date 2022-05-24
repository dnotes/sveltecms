import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
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
