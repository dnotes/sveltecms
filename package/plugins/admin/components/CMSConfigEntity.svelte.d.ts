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
export declare type CmsConfigEntityProps = typeof __propDef.props;
export declare type CmsConfigEntityEvents = typeof __propDef.events;
export declare type CmsConfigEntitySlots = typeof __propDef.slots;
export default class CmsConfigEntity extends SvelteComponentTyped<CmsConfigEntityProps, CmsConfigEntityEvents, CmsConfigEntitySlots> {
}
export {};
