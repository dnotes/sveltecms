import type { default as SvelteCMS, CMSPlugin, CMSConfigFieldConfigSetting } from '../..';
import type { RequestEvent } from '@sveltejs/kit';
export declare const fileStoresContentOptionFields: {
    [key: string]: CMSConfigFieldConfigSetting;
};
export declare function parseFormData(cms: SvelteCMS, contentType: string, formData: FormData): Promise<void>;
export declare function saveContentEndpoint(cms: SvelteCMS, contentType: string, event: RequestEvent): Promise<void>;
export declare function deleteContentEndpoint(cms: SvelteCMS, contentType: string, event: RequestEvent): Promise<void>;
export declare function parseFileStoreContentItem(_filepath: any, content: any, opts: any): Promise<any>;
declare const plugin: CMSPlugin;
export default plugin;
