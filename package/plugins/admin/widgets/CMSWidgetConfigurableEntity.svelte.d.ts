import { SvelteComponentTyped } from "svelte";
import type { ConfigSetting } from "sveltecms";
import type SvelteCMS from "sveltecms";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        type: string;
        id: string;
        items: string[];
        value: string | ConfigSetting;
        disabled?: boolean;
        unset?: string;
        forceEntityID?: string;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsWidgetConfigurableEntityProps = typeof __propDef.props;
export declare type CmsWidgetConfigurableEntityEvents = typeof __propDef.events;
export declare type CmsWidgetConfigurableEntitySlots = typeof __propDef.slots;
export default class CmsWidgetConfigurableEntity extends SvelteComponentTyped<CmsWidgetConfigurableEntityProps, CmsWidgetConfigurableEntityEvents, CmsWidgetConfigurableEntitySlots> {
}
export {};
