import { AdminPage, type AdminPageConfig } from './core/AdminPage';
import { Field, type FieldType, type FieldConfigSetting, type ConfigFieldConfigSetting } from './core/Field';
import { type WidgetType, type WidgetConfigSetting } from './core/Widget';
import { ContentType, type ContentTypeConfigSetting } from "./core/ContentType";
import type { MediaStoreType, MediaStoreConfigSetting } from './core/MediaStore';
import type { Content, ContentStoreConfigSetting, ContentStoreType } from './core/ContentStore';
import { type CollectionConfigSetting, type AdminCollectionConfigSetting, Collection } from './core/Collection';
import { type Transformer, type TransformerConfigSetting } from './core/Transformer';
import { type ScriptFunctionType } from './core/ScriptFunction';
import type { ComponentType, ComponentConfigSetting } from './core/Component';
export declare const FieldPropsAllowFunctions: string[];
export declare const cmsConfigurables: string[];
export declare type TypedEntity = {
    id: string;
    type: string;
};
export declare type TypedEntityConfigSetting = {
    id?: string;
    type: string;
};
export declare type ConfigurableEntity = {
    options?: ConfigSetting;
};
export declare type ConfigurableEntityConfigSetting = TypedEntityConfigSetting & {
    options?: ConfigSetting;
};
export declare type ConfigurableEntityConfigSettingValue<T> = string | T | (string | T)[];
export declare type LabeledEntity = {
    label: string;
};
export declare type FieldableEntityType = {
    isFieldable?: boolean;
    fields?: {
        [id: string]: FieldConfigSetting;
    };
};
export declare type FieldableEntity = {
    isFieldable: boolean;
    fields?: {
        [id: string]: Field;
    };
};
export declare type FieldableEntityConfigSetting = {
    fields: {
        [id: string]: string | FieldConfigSetting;
    };
};
export declare type EntityType = {
    id: string;
};
export declare type ConfigurableEntityType = EntityType & {
    optionFields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
    options?: ConfigSetting;
};
export declare type CMSConfigSetting = {
    configPath?: string;
    adminStore?: string | ContentStoreConfigSetting;
    types?: {
        [key: string]: ContentTypeConfigSetting;
    };
    lists?: {
        [key: string]: string | (string | number | {
            id: string | number;
            value: ConfigSetting;
        })[];
    };
    contentStores?: {
        [key: string]: ContentStoreConfigSetting;
    };
    mediaStores?: {
        [key: string]: MediaStoreConfigSetting;
    };
    fields?: {
        [key: string]: FieldConfigSetting;
    };
    widgets?: {
        [key: string]: WidgetConfigSetting;
    };
    collections?: {
        [key: string]: CollectionConfigSetting;
    };
    transformers?: {
        [key: string]: TransformerConfigSetting;
    };
    components?: {
        [key: string]: ComponentConfigSetting;
    };
};
export default class SvelteCMS {
    conf: CMSConfigSetting;
    admin: ContentType;
    adminPages?: {
        [key: string]: AdminPageConfig;
    };
    adminCollections?: {
        [key: string]: AdminCollectionConfigSetting;
    };
    fields: {
        [key: string]: FieldConfigSetting;
    };
    collections: {
        [key: string]: CollectionConfigSetting;
    };
    components: {
        [key: string]: ComponentType;
    };
    widgets: {
        [key: string]: WidgetConfigSetting;
    };
    scriptFunctions: {
        [key: string]: ScriptFunctionType;
    };
    fieldTypes: {
        [key: string]: FieldType;
    };
    widgetTypes: {
        [key: string]: WidgetType;
    };
    transformers: {
        [key: string]: Transformer;
    };
    contentStores: {
        [key: string]: ContentStoreType;
    };
    mediaStores: {
        [key: string]: MediaStoreType;
    };
    types: {
        [key: string]: ContentType;
    };
    lists: CMSListConfig;
    constructor(conf: CMSConfigSetting, plugins?: CMSPlugin[]);
    use(plugin: CMSPlugin, config?: any): void;
    preMount(container: ContentType | Field, values: Object): {};
    preSave(container: ContentType | Field, values: Object): {};
    doFieldTransforms(op: 'preSave' | 'preMount', field: Field, value: any): any;
    listEntities(type: string, includeAdmin?: boolean, arg?: string): string[];
    getEntity(type: string, id: string): any;
    getEntityParent(type: string, id: string): any;
    getEntityType(type: string, id: string): any;
    getFieldTypes(): string[];
    getFieldTypeWidgets(fieldType: any): string[];
    getContentType(contentType: string): ContentType;
    getContentStore(contentType: string | ContentType): import("./core/ContentStore").ContentStore;
    slugifyContent(content: any, contentType: ContentType, force?: boolean): any;
    getSlug(content: any, contentType: ContentType, force: boolean): any;
    listContent(contentType: string | ContentType, options?: {
        load?: boolean;
        [key: string]: any;
    }): Promise<Content[]>;
    /**
     * Gets an individual piece of content or all content of a content type
     * @param contentType string
     * The id of the content type
     * @param slug string
     * The text slug for an individual piece of content (optional)
     * If null or omitted, then all content of the type will be returned
     * @param options object
     * @returns object|object[]
     */
    getContent(contentType: string | ContentType, slug?: string | number | null, options?: {
        [key: string]: any;
    }): Promise<Content | Content[]>;
    saveContent(contentType: string | ContentType, content: any, options?: {
        [key: string]: any;
    }): Promise<Content>;
    deleteContent(contentType: string | ContentType, content: any, options?: {
        [key: string]: any;
    }): Promise<Content>;
    transform(value: any, conf: ConfigurableEntityConfigSettingValue<TransformerConfigSetting>): any;
    getConfigOptionValue(value: any): any;
    getConfigOptionsFromFields(optionFields: {
        [id: string]: ConfigFieldConfigSetting;
    }): ConfigSetting;
    mergeConfigOptions(options1: ConfigSetting, ...optionsAll: Array<string | ConfigSetting>): ConfigSetting;
    getInstanceOptions(entityType: ConfigurableEntityType, conf?: string | ConfigurableEntityConfigSetting): ConfigSetting;
    getWidgetFields(collection: FieldableEntity, vars: {
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): WidgetFieldCollection;
    initializeContentField(field: Field, vars: {
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    /**
     * Converts an object property (e.g. on a Field or an options object) into a getter which runs
     * one of the available functions.
     * @param obj The object on which the property is to be defined
     * @param prop The name of the property
     * @param vars The vars object for the defined function
     */
    initializeFunction(obj: {
        [key: string]: any;
    }, prop: string, vars: {
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    initializeConfigOptions(options: any, vars: {
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    getAdminPage(path: string): AdminPage;
    getEntityConfig(type: string, id: string, options?: string[]): any;
    getEntityConfigCollection(type: string, id: string): Collection;
    get defaultMediaStore(): string;
    _scriptFunctionHelp: any;
    get scriptFunctionHelp(): Array<{
        id: string;
        helptext?: string;
        params: Array<{
            id: string;
            multiple: boolean;
            helptext: string;
        }>;
    }>;
}
export declare type WidgetField = Field & {
    label: string;
    helptext?: string;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    class: string;
    multiple?: boolean;
    multipleLabel?: boolean;
    multipleMin?: number;
    multipleMax?: number;
};
export declare type WidgetFieldCollection = {
    fields: {
        [id: string]: WidgetField;
    };
    [key: string]: any;
};
/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export declare function getConfigPathFromValuePath(path: string): string;
/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export declare type ConfigSetting = {
    [key: string]: string | number | boolean | null | undefined | ConfigSetting | Array<string | number | ConfigSetting>;
};
export declare type CMSPlugin = {
    adminPages?: AdminPageConfig[];
    fieldTypes?: FieldType[];
    widgetTypes?: WidgetType[];
    transformers?: Transformer[];
    contentStores?: ContentStoreType[];
    mediaStores?: MediaStoreType[];
    collections?: CollectionConfigSetting[];
    adminCollections?: CollectionConfigSetting[];
    components?: Array<ComponentType | ComponentConfigSetting>;
    lists?: CMSListConfig;
    optionFields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
    fieldWidgets?: {
        [key: string]: string[];
    };
};
export declare type CMSPluginBuilder = (config: any) => CMSPlugin;
export declare type CMSListConfig = {
    [key: string]: Array<string | number | {
        id: string | number;
        value: any;
    }>;
};
