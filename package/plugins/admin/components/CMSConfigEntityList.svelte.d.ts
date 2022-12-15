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
export type CmsConfigEntityListProps = typeof __propDef.props;
export type CmsConfigEntityListEvents = typeof __propDef.events;
export type CmsConfigEntityListSlots = typeof __propDef.slots;
export default class CmsConfigEntityList extends SvelteComponentTyped<CmsConfigEntityListProps, CmsConfigEntityListEvents, CmsConfigEntityListSlots> {
}
export {};
