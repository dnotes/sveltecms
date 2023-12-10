import { SvelteComponentTyped } from "svelte";
import type { ConfigSetting } from "../../..";
import type SvelteCMS from "../../..";
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
export type CmsWidgetConfigurableEntityProps = typeof __propDef.props;
export type CmsWidgetConfigurableEntityEvents = typeof __propDef.events;
export type CmsWidgetConfigurableEntitySlots = typeof __propDef.slots;
export default class CmsWidgetConfigurableEntity extends SvelteComponentTyped<CmsWidgetConfigurableEntityProps, CmsWidgetConfigurableEntityEvents, CmsWidgetConfigurableEntitySlots> {
}
export {};
