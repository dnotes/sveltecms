import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '..';
import type { WidgetField } from '..';
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
export declare type CmsWidgetReferenceProps = typeof __propDef.props;
export declare type CmsWidgetReferenceEvents = typeof __propDef.events;
export declare type CmsWidgetReferenceSlots = typeof __propDef.slots;
export default class CmsWidgetReference extends SvelteComponentTyped<CmsWidgetReferenceProps, CmsWidgetReferenceEvents, CmsWidgetReferenceSlots> {
}
export {};
