import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
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
export declare type CmsComponentListProps = typeof __propDef.props;
export declare type CmsComponentListEvents = typeof __propDef.events;
export declare type CmsComponentListSlots = typeof __propDef.slots;
export default class CmsComponentList extends SvelteComponentTyped<CmsComponentListProps, CmsComponentListEvents, CmsComponentListSlots> {
}
export {};
