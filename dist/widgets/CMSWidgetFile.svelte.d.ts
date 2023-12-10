import { SvelteComponentTyped } from "svelte";
import type { WidgetField } from '..';
import type { Media } from "../core/MediaStore";
import type SvelteCMS from "..";
declare const __propDef: {
    props: {
        /**
           * The File Widget works with the SvelteCMS Media Chooser to provide Media input.
           * With the Media Chooser, this Widget will handle storing all Content and Value data,
           * while SvelteCMS handles storing the actual files.
           */ cms: SvelteCMS;
        field: WidgetField;
        id: string;
        value?: Media | Media[] | undefined;
        deleteFile?: (i?: number) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type CmsWidgetFileProps = typeof __propDef.props;
export type CmsWidgetFileEvents = typeof __propDef.events;
export type CmsWidgetFileSlots = typeof __propDef.slots;
export default class CmsWidgetFile extends SvelteComponentTyped<CmsWidgetFileProps, CmsWidgetFileEvents, CmsWidgetFileSlots> {
}
export {};
