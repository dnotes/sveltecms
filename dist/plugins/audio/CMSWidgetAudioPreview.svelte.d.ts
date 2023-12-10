import { SvelteComponentTyped } from "svelte";
import type { Media } from "../../core/MediaStore";
import type SvelteCMS from "../..";
import type { WidgetField } from "../..";
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
export type CmsWidgetAudioPreviewProps = typeof __propDef.props;
export type CmsWidgetAudioPreviewEvents = typeof __propDef.events;
export type CmsWidgetAudioPreviewSlots = typeof __propDef.slots;
export default class CmsWidgetAudioPreview extends SvelteComponentTyped<CmsWidgetAudioPreviewProps, CmsWidgetAudioPreviewEvents, CmsWidgetAudioPreviewSlots> {
}
export {};
