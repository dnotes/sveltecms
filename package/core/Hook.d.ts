import type SvelteCMS from "..";
import type { Content } from "./ContentStore";
import type ContentType from "./ContentType";
import type { EntityTemplate } from "./EntityTemplate";
export declare const templateHook: EntityTemplate;
export type Change = {
    before?: Content;
    after?: Content;
    contentType?: ContentType;
};
export declare class Changeset {
    before: Array<Content | undefined>;
    after: Array<Content | undefined>;
    contentType?: ContentType;
    constructor(contentType: ContentType);
    push(before?: Content, after?: Content): void;
}
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
    type: 'adminPreSave' | 'contentPreSave' | 'contentPreDelete';
};
export type ContentPostWriteHook = Hook & {
    fn: (change: Change, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'adminPostWrite' | 'contentPostWrite';
};
export type ContentPostWriteAllHook = Hook & {
    fn: (changeset: Changeset, cms: SvelteCMS, options: {
        [key: string]: any;
    }) => Promise<void>;
    type: 'contentPostWriteAll';
};
export type PluginHooks = Array<ContentPreWriteHook | ContentPostWriteHook | ContentPostWriteAllHook>;
export type CMSHookFunctions = {
    adminPreSave: ContentPreWriteHook[];
    contentPreSave: ContentPreWriteHook[];
    contentPreDelete: ContentPreWriteHook[];
    contentPostWrite: ContentPostWriteHook[];
    contentPostWriteAll: ContentPostWriteAllHook[];
};
export declare const hooks: PluginHooks;
export {};
