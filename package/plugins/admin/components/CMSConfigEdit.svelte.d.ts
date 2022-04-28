import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
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
export declare type CmsConfigEditProps = typeof __propDef.props;
export declare type CmsConfigEditEvents = typeof __propDef.events;
export declare type CmsConfigEditSlots = typeof __propDef.slots;
export default class CmsConfigEdit extends SvelteComponentTyped<CmsConfigEditProps, CmsConfigEditEvents, CmsConfigEditSlots> {
}
export {};
