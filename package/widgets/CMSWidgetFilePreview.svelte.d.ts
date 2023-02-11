import { SvelteComponentTyped } from "svelte";
import type { Media } from "../core/MediaStore";
import type SvelteCMS from "..";
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        id: string;
        field: WidgetField;
        value: Media;
    };
    events: {
        delete: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetFilePreviewProps = typeof __propDef.props;
export type CmsWidgetFilePreviewEvents = typeof __propDef.events;
export type CmsWidgetFilePreviewSlots = typeof __propDef.slots;
export default class CmsWidgetFilePreview extends SvelteComponentTyped<CmsWidgetFilePreviewProps, CmsWidgetFilePreviewEvents, CmsWidgetFilePreviewSlots> {
}
export {};
