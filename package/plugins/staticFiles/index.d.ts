/// <reference types="isomorphic-git__lightning-fs" />
import type { default as SvelteCMS, CMSPlugin, CMSConfigFieldConfigSetting } from '../..';
import type { PromisifiedFS } from '@isomorphic-git/lightning-fs';
export declare function getFs(databaseName: any): Promise<PromisifiedFS>;
export declare const databaseNameField: CMSConfigFieldConfigSetting;
export declare type staticFilesContentOptions = {
    databaseName: string;
    contentDirectory: string;
    prependContentTypeIdAs: "" | "directory" | "filename";
    fileExtension: "md" | "json" | "yml" | "yaml";
    markdownBodyField: string;
};
export declare const staticFilesContentOptionFields: {
    [key: string]: CMSConfigFieldConfigSetting;
};
export declare type staticFilesMediaOptions = {
    databaseName: string;
    staticDirectory: string;
    mediaDirectory: string;
    allowMediaTypes: string;
    maxUploadSize: string;
};
export declare const staticFilesMediaOptionFields: {
    [key: string]: CMSConfigFieldConfigSetting;
};
export declare function saveContentEndpoint(cms: SvelteCMS, contentTypeID: string, request: Request, options?: {}): Promise<any>;
export declare function deleteContentEndpoint(cms: SvelteCMS, contentTypeID: string, request: Request, options?: {}): Promise<any>;
export declare function parseFileStoreContentItem(_filepath: any, content: any, opts: any): Promise<any>;
declare const plugin: CMSPlugin;
export default plugin;
