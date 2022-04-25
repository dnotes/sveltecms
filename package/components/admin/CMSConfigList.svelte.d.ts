import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigListProps = typeof __propDef.props;
export declare type CmsConfigListEvents = typeof __propDef.events;
export declare type CmsConfigListSlots = typeof __propDef.slots;
export default class CmsConfigList extends SvelteComponentTyped<CmsConfigListProps, CmsConfigListEvents, CmsConfigListSlots> {
}
export {};
