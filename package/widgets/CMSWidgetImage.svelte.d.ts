import { SvelteComponentTyped } from "svelte";
export declare type CMSImage = {
    src: string;
    filename?: string;
    alt?: string;
    title?: string;
    attribution?: string;
};
export declare type CMSPreviewImage = CMSImage & {
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
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetImageProps = typeof __propDef.props;
export declare type CmsWidgetImageEvents = typeof __propDef.events;
export declare type CmsWidgetImageSlots = typeof __propDef.slots;
export default class CmsWidgetImage extends SvelteComponentTyped<CmsWidgetImageProps, CmsWidgetImageEvents, CmsWidgetImageSlots> {
}
export {};
