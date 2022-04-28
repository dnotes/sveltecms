import type { default as SvelteCMS, CMSContentField, CMSContentType } from '..';
export declare function collapseFormItem(cms: SvelteCMS, contentType: CMSContentType, fields: {
    [id: string]: CMSContentField;
}, data: any, prefix?: string): Promise<any>;
/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export declare function formDataHandler(cms: SvelteCMS, contentType: string | CMSContentType, formdata: FormData): Promise<any>;
export default formDataHandler;
