import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
import type SvelteCMS from '..';
declare const __propDef: {
    props: {
        field: WidgetField;
        id?: string;
        cms: SvelteCMS;
        value?: {};
        collapsed?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetFieldgroupProps = typeof __propDef.props;
export type CmsWidgetFieldgroupEvents = typeof __propDef.events;
export type CmsWidgetFieldgroupSlots = typeof __propDef.slots;
export default class CmsWidgetFieldgroup extends SvelteComponentTyped<CmsWidgetFieldgroupProps, CmsWidgetFieldgroupEvents, CmsWidgetFieldgroupSlots> {
}
export {};
