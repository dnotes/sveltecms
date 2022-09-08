import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '../../..';
import type { ConfigSetting } from '../../..';
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
export declare type CmsConfigEntityListProps = typeof __propDef.props;
export declare type CmsConfigEntityListEvents = typeof __propDef.events;
export declare type CmsConfigEntityListSlots = typeof __propDef.slots;
export default class CmsConfigEntityList extends SvelteComponentTyped<CmsConfigEntityListProps, CmsConfigEntityListEvents, CmsConfigEntityListSlots> {
}
export {};
