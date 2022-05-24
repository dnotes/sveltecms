/// <reference types="isomorphic-git__lightning-fs" />
import type { CMSPlugin } from 'sveltecms';
import type { ConfigFieldConfigSetting } from 'sveltecms/core/Field';
import type { PromisifiedFS } from '@isomorphic-git/lightning-fs';
export declare function getFs(databaseName: any): Promise<PromisifiedFS>;
export declare const databaseNameField: ConfigFieldConfigSetting;
export declare type staticFilesContentOptions = {
    contentDirectory: string;
    prependContentTypeIdAs: "" | "directory" | "filename";
    fileExtension: "md" | "json" | "yml" | "yaml";
    markdownBodyField: string;
};
export declare const staticFilesContentOptionFields: {
    [key: string]: ConfigFieldConfigSetting;
};
export declare type staticFilesMediaOptions = {
    staticDirectory: string;
    mediaDirectory: string;
    allowMediaTypes: string;
    maxUploadSize: string;
};
export declare const staticFilesMediaOptionFields: {
    [key: string]: ConfigFieldConfigSetting;
};
export declare function parseFileStoreContentItem(_filepath: any, content: any, opts: any): Promise<any>;
export declare function getSlugFromFilepath(filepath: string, contentTypeID: string, opts: staticFilesContentOptions): string;
declare const plugin: CMSPlugin;
export default plugin;
