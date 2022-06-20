import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        value: string | {
            src: string;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FileProps = typeof __propDef.props;
export declare type FileEvents = typeof __propDef.events;
export declare type FileSlots = typeof __propDef.slots;
export default class File extends SvelteComponentTyped<FileProps, FileEvents, FileSlots> {
}
export {};
