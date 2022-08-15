import { AdminPage, type AdminPageConfig } from './core/AdminPage';
import { Field, type FieldType, type FieldConfigSetting, type ConfigFieldConfigSetting } from './core/Field';
import { type WidgetType, type WidgetConfigSetting } from './core/Widget';
import { ContentType, type ContentTypeConfigSetting } from "./core/ContentType";
import { type MediaStoreType, type MediaStoreConfigSetting } from './core/MediaStore';
import { type Content, type ContentStoreConfigSetting, type ContentStoreType, type Value } from './core/ContentStore';
import { type FieldgroupConfigSetting, type AdminFieldgroupConfigSetting, Fieldgroup } from './core/Fieldgroup';
import { type Transformer, type TransformerConfigSetting } from './core/Transformer';
import { type ScriptFunctionType, type ScriptFunctionConfig } from './core/ScriptFunction';
import { type ComponentType, type ComponentConfigSetting, type Component } from 'sveltecms/core/Component';
import { type DisplayConfigSetting } from 'sveltecms/core/Display';
import type { EntityTemplate } from './core/EntityTemplate';
import SlugConfig from './core/Slug';
import { Indexer, type IndexerConfigSetting, type IndexerType, type IndexItem } from './core/Indexer';
import { type CMSHookFunctions, type PluginHooks } from './core/Hook';
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
    label: string | ScriptFunctionConfig;
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
export declare type DisplayableEntity = {
    display?: string | false | DisplayConfigSetting;
    displayModes?: {
        [key: string]: string | false | DisplayConfigSetting;
    };
    displayComponent?: Component;
};
export declare type DisplayableEntityType = EntityType & {
    display?: string | false | DisplayConfigSetting;
    displayModes?: {
        [key: string]: string | false | DisplayConfigSetting;
    };
    displayComponent?: string;
};
export declare type DisplayableEntityConfigSetting = {
    display?: string | false | DisplayConfigSetting;
    displayModes?: {
        [key: string]: string | false | DisplayConfigSetting;
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
declare type CMSSettings = ConfigSetting & {
    adminStore?: string | ContentStoreConfigSetting;
    indexer?: string | IndexerConfigSetting;
    rootContentType?: string;
    frontPageSlug?: string;
    defaultContentDisplay?: string | false | DisplayConfigSetting;
    defaultContentDisplayModes?: {
        [key: string]: string | false | DisplayConfigSetting;
    };
};
export declare type CMSConfigSetting = {
    configPath?: string;
    settings?: CMSSettings;
    adminStore?: string | ContentStoreConfigSetting;
    contentTypes?: {
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
    fieldgroups?: {
        [key: string]: FieldgroupConfigSetting;
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
    entityTypes: {
        component: EntityTemplate;
        contentStore: EntityTemplate;
        contentType: EntityTemplate;
        display: EntityTemplate;
        field: EntityTemplate;
        fieldgroup: EntityTemplate;
        mediaStore: EntityTemplate;
        slug: EntityTemplate;
        transformer: {
            id: string;
            label: string;
            labelPlural: string;
            description: string;
            typeField: boolean;
            typeInherits: boolean;
            typeRestricted: boolean;
            isConfigurable: boolean;
        };
        widget: EntityTemplate;
        indexer: EntityTemplate;
    };
    admin: ContentType;
    indexer: Indexer;
    adminPages?: {
        [key: string]: AdminPageConfig;
    };
    adminFieldgroups?: {
        [key: string]: AdminFieldgroupConfigSetting;
    };
    fields: {
        [key: string]: FieldConfigSetting;
    };
    fieldgroups: {
        [key: string]: FieldgroupConfigSetting;
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
        [key: string]: FieldType & {
            widgetTypes?: string[];
        };
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
    indexers: {
        [key: string]: IndexerType;
    };
    contentTypes: {
        [key: string]: ContentType;
    };
    defaultContentType: ContentType;
    lists: CMSListConfig;
    hooks: CMSHookFunctions;
    constructor(conf: CMSConfigSetting, plugins?: CMSPlugin[]);
    use(plugin: CMSPlugin, config?: any): void;
    preMount(fieldableEntity: ContentType | Field | Fieldgroup, values: Content): Content;
    preSave(fieldableEntity: ContentType | Field | Fieldgroup, values: Content): Content;
    doFieldTransforms(op: 'preSave' | 'preMount', field: Field, value: any): any;
    listEntities(type: string, includeAdmin?: boolean, entityID?: string): string[];
    getEntityType(type: string): EntityTemplate;
    getEntity(type: string, id: string): any;
    getEntityParent(type: string, id: string): any;
    getEntityRoot(type: string, id: string): any;
    getFieldTypes(includeAdmin?: boolean): string[];
    getFieldTypeWidgets(includeAdmin?: boolean, fieldTypeID?: string): string[];
    getContentType(contentType: string): ContentType;
    getContentStore(contentType: string | ContentType): import("./core/ContentStore").ContentStore;
    getUrl(item: Content, contentTypeID?: string): string;
    slugifyContent(content: Content | Content[], contentType: ContentType, force?: boolean): Content | Content[];
    getSlug(content: any, slug: SlugConfig, force: boolean): any;
    listContent(contentTypes: string | ContentType | Array<string | ContentType>, options?: string | {
        skipIndex?: boolean;
        getRaw?: boolean;
        searchText?: string | undefined;
        [key: string]: any;
    }): Promise<Content[]>;
    /**
     * Gets an individual piece of content or all content of a content type
     * @param contentType string
     * The id of the content type
     * @param slug string
     * The text slug for an individual piece of content
     * @param options object
     * @returns object
     */
    getContent(contentType: string | ContentType, slug: string | number | null, options?: {
        [key: string]: any;
    }): Promise<Content>;
    saveContent(contentType: string | ContentType, content: Content | Content[], options?: {
        skipHooks?: boolean;
        skipIndex?: boolean;
        [key: string]: any;
    }): Promise<Content | Content[]>;
    deleteContent(contentType: string | ContentType, content: Content | Content[], options?: {
        skipHooks?: boolean;
        skipIndex?: boolean;
        [key: string]: any;
    }): Promise<Content | Content[]>;
    newContent(contentTypeID: string, values?: {
        [id: string]: Value;
    }): Content;
    getIndexItem(content?: Content): IndexItem | undefined;
    runHook(type: string, ...args: any[]): Promise<void>;
    transform(value: any, conf: ConfigurableEntityConfigSettingValue<TransformerConfigSetting>): any;
    getConfigOptionValue(value: any): any;
    getConfigOptionsFromFields(optionFields: {
        [id: string]: ConfigFieldConfigSetting;
    }): ConfigSetting;
    mergeConfigOptions(options1: ConfigSetting, ...optionsAll: Array<string | ConfigSetting>): ConfigSetting;
    getWidgetFields(fieldgroup: FieldableEntity, vars: {
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): WidgetFieldFieldgroup;
    findFields(fields: {
        [id: string]: Field;
    }, query: {
        [path: string]: string | number | boolean;
    } | ((item: Field) => boolean), prefix?: string): string[];
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
    getInstanceOptions(entityType: ConfigurableEntityType, conf?: string | ConfigurableEntityConfigSetting): ConfigSetting;
    /**
     * Recursive helper function to get the descendant configuration from an entity object
     * @param entity An Entity object
     * @param options A list of options to retreive from the entity
     * @returns
     */
    _getEntityConfig(entity: any, options: string[]): ConfigSetting;
    /**
     * Get the full config setting for a particular entity
     * @param type The Entity Type, e.g. 'field'
     * @param entity The ID of the particular entity to get
     * @param options The list of options and properties for the entity (so they aren't looked up more than once)
     * @returns ConfigSetting
     */
    getEntityConfig(type: string, id: string, parentOnly?: boolean): ConfigSetting;
    /**
     * Get the list of configuration fields for a specific object
     * @param type The Entity Type, e.g. 'field'
     * @param id The ID of a specific entity
     * @returns An object whose values are ConfigFieldConfigSettings
     */
    getEntityConfigFields(type: string, id?: string): {
        [id: string]: ConfigFieldConfigSetting;
    };
    /**
     * Get the full Fieldgroup object for configuring an entity.
     * @param type The Entity Type
     * @param id The Entity ID (needed for option fields)
     * @returns Fieldgroup
     */
    getEntityConfigFieldgroup(type: string, id?: string): Fieldgroup;
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
export declare type WidgetFieldFieldgroup = {
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
export declare type EntityConfigSetting = ConfigSetting & {
    id?: string;
    type?: string;
};
export declare type CMSPlugin = {
    id: string;
    adminPages?: AdminPageConfig[];
    fieldTypes?: FieldType[];
    widgetTypes?: WidgetType[];
    transformers?: Transformer[];
    indexers?: IndexerType[];
    contentStores?: ContentStoreType[];
    mediaStores?: MediaStoreType[];
    fieldgroups?: FieldgroupConfigSetting[];
    adminFieldgroups?: FieldgroupConfigSetting[];
    components?: ComponentType[];
    lists?: CMSListConfig;
    optionFields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
    fieldWidgets?: {
        [key: string]: string[];
    };
    hooks?: PluginHooks;
    scriptFunctions?: ScriptFunctionType[];
};
export declare type CMSPluginBuilder = (config: any) => CMSPlugin;
export declare type CMSListConfig = {
    [key: string]: Array<string | number | {
        id: string | number;
        value: any;
    }>;
};
export {};
