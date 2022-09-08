import type SvelteCMS from "..";
import type { Content } from "./ContentStore";
import type ContentType from "./ContentType";
export declare type Change = {
    before?: Content;
    after?: Content;
    contentType?: ContentType;
};
declare type Hook = {
    type: string;
    label: string;
    description: string;
    fn: Function;
    weight?: number;
};
export declare type ContentPreWriteHook = Hook & {
    fn: (content: Content, contentType: ContentType, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'contentPreSave' | 'contentPreDelete';
};
export declare type ContentPostWriteHook = Hook & {
    fn: (change: Change, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'contentPostWrite';
};
export declare type PluginHooks = Array<ContentPreWriteHook | ContentPostWriteHook>;
export declare type CMSHookFunctions = {
    contentPreSave: ContentPreWriteHook[];
    contentPreDelete: ContentPreWriteHook[];
    contentPostWrite: ContentPostWriteHook[];
};
export declare const hooks: PluginHooks;
export {};
