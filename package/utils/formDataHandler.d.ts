import type SvelteCMS from 'sveltecms';
import type ContentType from 'sveltecms/core/ContentType';
import type Field from 'sveltecms/core/Field';
export declare function collapseFormItem(cms: SvelteCMS, contentType: ContentType, fields: {
    [id: string]: Field;
}, data: any, prefix?: string): Promise<any>;
/**
 * Converts FormData into an object to be saved to a content store.
 * @param cms SvelteCMS
 * @param contentType CMSContentType
 * @param formdata FormData
 */
export declare function formDataHandler(cms: SvelteCMS, contentType: string | ContentType, formdata: FormData): Promise<any>;
export default formDataHandler;
