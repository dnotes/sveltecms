import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from 'sveltecms';
import type { ConfigSetting } from 'sveltecms';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: {
            [id: string]: string | ConfigSetting;
        };
        options: {
            configType: string;
            configPath: string;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigEntityListOldProps = typeof __propDef.props;
export declare type CmsConfigEntityListOldEvents = typeof __propDef.events;
export declare type CmsConfigEntityListOldSlots = typeof __propDef.slots;
export default class CmsConfigEntityListOld extends SvelteComponentTyped<CmsConfigEntityListOldProps, CmsConfigEntityListOldEvents, CmsConfigEntityListOldSlots> {
}
export {};
