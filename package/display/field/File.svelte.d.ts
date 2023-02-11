import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type Field from "../../core/Field";
import type { Media } from "../../core/MediaStore";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: string | Media;
        displayMode: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type FileProps = typeof __propDef.props;
export type FileEvents = typeof __propDef.events;
export type FileSlots = typeof __propDef.slots;
export default class File extends SvelteComponentTyped<FileProps, FileEvents, FileSlots> {
}
export {};
