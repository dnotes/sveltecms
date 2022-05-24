import { SvelteComponentTyped } from "svelte";
export declare class CMSFile {
    src: string;
    filename: string;
    title?: string;
    attribution?: string;
    size?: number;
    type?: string;
    date?: Date;
    isCMSFile: true;
    stringify: boolean;
    toString(): string;
    toJSON(): string | {
        src: string;
        title: string;
        attribution: string;
        size: number;
        date: Date;
    };
    constructor(src: string | CMSFile, stringify: boolean, file?: string | File);
    get displayDate(): string;
    get displaySize(): any;
}
import type { WidgetField } from "..";
declare const __propDef: {
    props: {
        field: WidgetField;
        id: string;
        value: string | CMSFile | Array<string | CMSFile>;
        files: any;
        input?: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CmsWidgetFileProps = typeof __propDef.props;
export declare type CmsWidgetFileEvents = typeof __propDef.events;
export declare type CmsWidgetFileSlots = typeof __propDef.slots;
export default class CmsWidgetFile extends SvelteComponentTyped<CmsWidgetFileProps, CmsWidgetFileEvents, CmsWidgetFileSlots> {
}
export {};
