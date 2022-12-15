import { SvelteComponentTyped } from "svelte";
export type CMSImage = {
    src: string;
    filename?: string;
    alt?: string;
    title?: string;
    attribution?: string;
};
export type CMSPreviewImage = CMSImage & {
    title: string;
};
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value?: string | CMSImage | string[] | CMSImage[] | {};
        files?: any;
        previews?: any;
        input?: any;
        getPreview?: (f: string | CMSImage) => CMSPreviewImage;
        handleUpload?: () => void;
        deleteImage?: (previewIndex: any) => void;
    };
    events: {
        click: MouseEvent;
    } & {
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
