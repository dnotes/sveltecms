import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '../../../..';
import type { WidgetField } from '../../../..';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetDefaultValueProps = typeof __propDef.props;
export type CmsWidgetDefaultValueEvents = typeof __propDef.events;
export type CmsWidgetDefaultValueSlots = typeof __propDef.slots;
export default class CmsWidgetDefaultValue extends SvelteComponentTyped<CmsWidgetDefaultValueProps, CmsWidgetDefaultValueEvents, CmsWidgetDefaultValueSlots> {
}
export {};
