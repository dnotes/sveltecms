import type { default as SvelteCMS, CMSPlugin, CMSConfigFieldConfigSetting } from '../..';
export declare const fileStoresContentOptionFields: {
    [key: string]: CMSConfigFieldConfigSetting;
};
/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export declare function formDataHandler(cms: SvelteCMS, contentTypeID: string, formdata: FormData): Promise<any>;
export declare function saveContentEndpoint(cms: SvelteCMS, contentTypeID: string, request: Request, options?: {}): Promise<any>;
export declare function deleteContentEndpoint(cms: SvelteCMS, contentTypeID: string, request: Request, options?: {}): Promise<any>;
export declare function parseFileStoreContentItem(_filepath: any, content: any, opts: any): Promise<any>;
declare const plugin: CMSPlugin;
export default plugin;
