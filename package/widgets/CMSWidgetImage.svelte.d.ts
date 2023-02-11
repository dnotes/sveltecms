import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from "..";
import type { Media } from "../core/MediaStore";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        /**
         * The Image Widget works with the SvelteCMS Media Chooser to provide Media input.
         * With the Media Chooser, this Widget will handle storing all Content and Value data,
         * while SvelteCMS handles storing the actual files.
         */ cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value?: Media | Media[] | undefined;
        deleteImage?: (i?: number) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetImageProps = typeof __propDef.props;
export type CmsWidgetImageEvents = typeof __propDef.events;
export type CmsWidgetImageSlots = typeof __propDef.slots;
export default class CmsWidgetImage extends SvelteComponentTyped<CmsWidgetImageProps, CmsWidgetImageEvents, CmsWidgetImageSlots> {
}
export {};
