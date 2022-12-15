import type SvelteCMS from "..";
import type { Content } from "./ContentStore";
import type ContentType from "./ContentType";
export type Change = {
    before?: Content;
    after?: Content;
    contentType?: ContentType;
};
type Hook = {
    type: string;
    label: string;
    description: string;
    fn: Function;
    weight?: number;
};
export type ContentPreWriteHook = Hook & {
    fn: (content: Content, contentType: ContentType, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'contentPreSave' | 'contentPreDelete';
};
export type ContentPostWriteHook = Hook & {
    fn: (change: Change, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'contentPostWrite';
};
export type PluginHooks = Array<ContentPreWriteHook | ContentPostWriteHook>;
export type CMSHookFunctions = {
    contentPreSave: ContentPreWriteHook[];
    contentPreDelete: ContentPreWriteHook[];
    contentPostWrite: ContentPostWriteHook[];
};
export declare const hooks: PluginHooks;
export {};
