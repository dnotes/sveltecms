import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: string[];
        adminPath: string;
        save?: () => Promise<Response>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsComponentListOldProps = typeof __propDef.props;
export type CmsComponentListOldEvents = typeof __propDef.events;
export type CmsComponentListOldSlots = typeof __propDef.slots;
export default class CmsComponentListOld extends SvelteComponentTyped<CmsComponentListOldProps, CmsComponentListOldEvents, CmsComponentListOldSlots> {
}
export {};
