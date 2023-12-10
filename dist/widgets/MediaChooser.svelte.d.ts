import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '..';
import type { WidgetField } from '..';
import type { Media } from '../core/MediaStore';
declare const __propDef: {
    props: {
        /**
         * This widget is a helper for widgets and Fields that handle media.
         *
         * Scenarios:
         *
         * 1. A new piece of Content is being created, with a Field that handles Media.
         *    The Widget will instantiate this component with a value of '' or {} or [].
         *    The "previews" array will be empty.
         *    As new Media is uploaded, chosen, or linked, the previews must be updated.
         *    When the Content is saved, any uploaded Media will be saved along with
         *    the field value. (formDataHandler)
         *    After all Content has been saved, the Media Index will be updated with all
         *    changes to Media fields. (in a contentPostWrite hook)
         *
         * 2. A piece of Content is being edited, with a Field that handles Media.
         *    The Widget will instantiate this component with a value that is a string,
         *    Media, or an array of the same.
         *    The "_previews" and "previews" arrays should be created from the initial value.
         *    Media will be saved an indexed as in 1.
         *
         * 3. A piece of Content is being deleted, with a Field that handles Media.
         *    The Widget is instantiated as in 2.
         *    Uploaded Media is not saved.
         *    After the Content is deleted, the Media Index will be updated with all
         *    changes to Media fields. (in a contnetPostDelete hook)
         *
         * B. If the mediaStore is immediateUpload, any uploaded Media is uploaded immediately,
         *    and the "previews" are created with actual URLs. If any previews are deleted,
         *    the uploaded Media is also deleted immediately.
         */ field: WidgetField;
        id: string;
        cms: SvelteCMS;
        value: Media | Media[];
        files?: FileList;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type MediaChooserProps = typeof __propDef.props;
export type MediaChooserEvents = typeof __propDef.events;
export type MediaChooserSlots = typeof __propDef.slots;
export default class MediaChooser extends SvelteComponentTyped<MediaChooserProps, MediaChooserEvents, MediaChooserSlots> {
}
export {};
