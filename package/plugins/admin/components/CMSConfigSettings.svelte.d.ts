import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
import type { ConfigSetting } from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: ConfigSetting;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigSettingsProps = typeof __propDef.props;
export declare type CmsConfigSettingsEvents = typeof __propDef.events;
export declare type CmsConfigSettingsSlots = typeof __propDef.slots;
export default class CmsConfigSettings extends SvelteComponentTyped<CmsConfigSettingsProps, CmsConfigSettingsEvents, CmsConfigSettingsSlots> {
}
export {};
