import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type { Value } from "../../core/ContentStore";
import type Field from "../../core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: string | {
            [key: string]: Value;
            src: string;
        };
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
