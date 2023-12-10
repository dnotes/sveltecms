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
export type CmsWidgetImagePreviewProps = typeof __propDef.props;
export type CmsWidgetImagePreviewEvents = typeof __propDef.events;
export type CmsWidgetImagePreviewSlots = typeof __propDef.slots;
export default class CmsWidgetImagePreview extends SvelteComponentTyped<CmsWidgetImagePreviewProps, CmsWidgetImagePreviewEvents, CmsWidgetImagePreviewSlots> {
}
export {};
