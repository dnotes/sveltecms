import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { CMSContentFieldConfigSetting } from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        items: Array<[string, string | CMSContentFieldConfigSetting]>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigFieldListProps = typeof __propDef.props;
export declare type CmsConfigFieldListEvents = typeof __propDef.events;
export declare type CmsConfigFieldListSlots = typeof __propDef.slots;
export default class CmsConfigFieldList extends SvelteComponentTyped<CmsConfigFieldListProps, CmsConfigFieldListEvents, CmsConfigFieldListSlots> {
}
export {};
