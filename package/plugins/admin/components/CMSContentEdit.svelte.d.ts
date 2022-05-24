import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        basePath: string;
        adminPath: string;
        data: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsContentEditProps = typeof __propDef.props;
export declare type CmsContentEditEvents = typeof __propDef.events;
export declare type CmsContentEditSlots = typeof __propDef.slots;
export default class CmsContentEdit extends SvelteComponentTyped<CmsContentEditProps, CmsContentEditEvents, CmsContentEditSlots> {
}
export {};
