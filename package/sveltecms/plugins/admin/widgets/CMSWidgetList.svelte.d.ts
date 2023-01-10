import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '../../../..';
import type { WidgetField } from '../../../..';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value?: any[];
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetListProps = typeof __propDef.props;
export type CmsWidgetListEvents = typeof __propDef.events;
export type CmsWidgetListSlots = typeof __propDef.slots;
export default class CmsWidgetList extends SvelteComponentTyped<CmsWidgetListProps, CmsWidgetListEvents, CmsWidgetListSlots> {
}
export {};
