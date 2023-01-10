import type { CMSPlugin } from "../../core/Plugin";
import type { FieldConfigSetting } from "../../core/Field";
import SlugConfig from "../../core/Slug";
export type ImportData = {
    dir: string;
    format: string;
    bodyField?: string;
    contentTypeID: string;
    slugFields: string;
    indexedFields: string;
    referenceFields: string;
    createContentType: boolean;
    importContent: boolean;
};
export type ImportFieldTypes = 'markdown' | 'text' | 'boolean' | 'number' | 'float' | 'date' | 'fieldgroup';
export type ImportFieldConfigSetting = Omit<FieldConfigSetting, 'type' | 'fields'> & {
    type: ImportFieldTypes;
    fields?: {
        [key: string]: ImportFieldConfigSetting;
    };
};
export type ImportReferenceField = {
    id: string;
    slugConfig: SlugConfig;
    displayKey: string;
};
declare const plugin: CMSPlugin;
export default plugin;
