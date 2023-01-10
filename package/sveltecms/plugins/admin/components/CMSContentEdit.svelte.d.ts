import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '../../../..';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        adminPath: string;
        data: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsContentEditProps = typeof __propDef.props;
export type CmsContentEditEvents = typeof __propDef.events;
export type CmsContentEditSlots = typeof __propDef.slots;
export default class CmsContentEdit extends SvelteComponentTyped<CmsContentEditProps, CmsContentEditEvents, CmsContentEditSlots> {
}
export {};
