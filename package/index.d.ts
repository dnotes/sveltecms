import { CMSFieldFunctionConfig } from './fieldFunctions';
import { default as Validator, Rules } from 'validatorjs';
export declare const CMSContentFieldPropsAllowFunctions: string[];
export default class SvelteCMS {
    adminStore: CMSContentStore;
    adminPaths: {
        [key: string]: Object;
    };
    fields: {
        [key: string]: CMSContentFieldConfigSetting;
    };
    widgets: {
        [key: string]: CMSWidgetTypeConfigSetting;
    };
    fieldFunctions: {
        [key: string]: CMSFieldFunctionType;
    };
    fieldTypes: {
        [key: string]: CMSFieldType;
    };
    widgetTypes: {
        [key: string]: CMSWidgetType;
    };
    transformers: {
        [key: string]: CMSFieldTransformer;
    };
    contentStores: {
        [key: string]: CMSContentStoreType;
    };
    mediaStores: {
        [key: string]: CMSMediaStoreType;
    };
    types: {
        [key: string]: CMSContentType;
    };
    lists: CMSListConfig;
    constructor(conf: CMSConfigSetting, plugins?: CMSPlugin[]);
    use(plugin: CMSPlugin, config?: any): void;
    preMount(contentTypeOrField: string | CMSContentField, values: Object): {};
    preSave(contentTypeOrField: string | CMSContentField, values: Object): {};
    doTransforms(op: 'preSave' | 'preMount', field: CMSContentField, value: any): any;
    getContentType(contentType: string): CMSContentType;
    getCollection(contentType: string, valuePath: string): CMSContentField;
    getContentStore(contentType: string): CMSContentStore;
    slugifyContent(content: any, contentType: CMSContentType, force?: boolean): any;
    getSlug(content: any, contentType: CMSContentType, force: boolean): any;
    listContent(contentType: string, options?: {
        [key: string]: any;
    }): Promise<Array<any>>;
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
    getContent(contentType: string, slug?: string | number | null, options?: {
        [key: string]: any;
    }): Promise<any>;
    saveContent(contentType: string, content: any, options?: {
        [key: string]: any;
    }): Promise<any>;
    deleteContent(contentType: string, content: any, options?: {
        [key: string]: any;
    }): Promise<any>;
    runFunction(functionType: 'transformers' | 'contentStorage' | 'mediaStorage', conf: string | CMSFieldTransformerSetting, value: any): any;
    getConfigOptionValue(value: any): any;
    getConfigOptionsFromFields(optionFields: {
        [id: string]: CMSConfigFieldConfigSetting;
    }): ConfigSetting;
    mergeConfigOptions(options1: ConfigSetting, ...optionsAll: Array<string | ConfigSetting>): ConfigSetting;
    getValidator(typeID: string, values: Object): Validator.Validator<Object>;
    getWidgetFields(collection: CMSContentType | CMSContentField, vars: {
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): CMSWidgetFieldCollection;
    initializeContentField(field: CMSContentField, vars: {
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    /**
     * Converts an object property (e.g. on a CMSContentField or an options object) into a getter which runs
     * one of the available functions.
     * @param obj The object on which the property is to be defined
     * @param prop The name of the property
     * @param vars The vars object for the defined function
     */
    initializeFunction(obj: {
        [key: string]: any;
    }, prop: string, vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    initializeConfigOptions(options: any, vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }): void;
    getValidatorConfig(fieldset: {
        [id: string]: CMSContentField;
    }): Rules;
    get defaultMediaStore(): string;
}
export declare type CMSSlugConfigSetting = {
    fields: string | string[];
    separator?: string;
    slugify?: string | CMSFieldTransformerSetting;
};
export declare class CMSSlugConfig {
    fields: string[];
    separator: string;
    slugify: string | CMSFieldTransformerSetting;
    constructor(conf: string | string[] | CMSSlugConfigSetting, cms: SvelteCMS);
}
export declare class CMSContentType {
    id: string;
    label: string;
    slug: CMSSlugConfig;
    contentStore: CMSContentStore;
    mediaStore?: string | CMSStoreConfigSetting;
    fields: {
        [key: string]: CMSContentField;
    };
    form?: {
        method?: 'post' | 'get';
        action?: string;
        previewComponent?: string;
    };
    constructor(id: any, conf: CMSContentTypeConfigSetting, cms: SvelteCMS);
}
export declare type CMSWidgetField = CMSContentField & {
    label: string;
    tooltip?: string;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    class: string;
    collapsible?: boolean;
    collapsed?: boolean;
    multiple?: boolean;
    multipleLabel?: boolean;
    multipleMin?: number;
    multipleMax?: number;
};
export declare type CMSWidgetFieldCollection = {
    fields: {
        [id: string]: CMSWidgetField;
    };
    [key: string]: any;
};
export declare class CMSContentField {
    id: string;
    type: string;
    label: string | CMSFieldFunctionConfig;
    tooltip?: string | CMSFieldFunctionConfig;
    required?: boolean | CMSFieldFunctionConfig;
    disabled?: boolean | CMSFieldFunctionConfig;
    hidden?: boolean | CMSFieldFunctionConfig;
    class: string | CMSFieldFunctionConfig;
    default?: any;
    value?: any;
    events?: {
        on: string;
        function: CMSFieldFunctionConfig;
    }[];
    collapsible?: boolean | CMSFieldFunctionConfig;
    collapsed?: boolean | CMSFieldFunctionConfig;
    multiple?: boolean | CMSFieldFunctionConfig;
    multipleLabel?: boolean | CMSFieldFunctionConfig;
    multipleMin?: number | CMSFieldFunctionConfig;
    multipleMax?: number | CMSFieldFunctionConfig;
    validator?: Rules;
    fields?: {
        [key: string]: CMSContentField;
    };
    widget: CMSWidget;
    preSave?: (string | CMSFieldTransformerSetting)[];
    preMount?: (string | CMSFieldTransformerSetting)[];
    mediaStore?: CMSMediaStore;
    values: {
        [key: string]: any;
    };
    errors: {
        [key: string]: any;
    };
    touched: {
        [key: string]: any;
    };
    constructor(id: any, conf: string | CMSContentFieldConfigSetting, cms: SvelteCMS, contentType: CMSContentType);
}
export declare class CMSWidget {
    type: string;
    widget: Object;
    handlesMultiple: boolean;
    handlesMedia: boolean;
    options?: ConfigSetting;
    formDataHandler?: FormDataHandler;
    constructor(conf: string | CMSWidgetTypeConfigSetting, cms: SvelteCMS);
}
export declare class CMSContentStore {
    id: string;
    listContent: (contentType: CMSContentType, options: ConfigSetting) => Promise<any[]>;
    getContent: (contentType: CMSContentType, options: ConfigSetting, slug?: string | number) => Promise<any | any[]>;
    saveContent: (content: any, contentType: CMSContentType, options: ConfigSetting) => Promise<any>;
    deleteContent: (content: any, contentType: CMSContentType, options: ConfigSetting) => Promise<any>;
    options: ConfigSetting;
    constructor(conf: string | CMSStoreConfigSetting, cms: SvelteCMS);
}
export declare class CMSMediaStore {
    id: string;
    listMedia: (path?: string | null, options?: ConfigSetting) => Promise<string[]>;
    getMedia: (filename?: string | number | null, options?: ConfigSetting) => Promise<string | string[]>;
    saveMedia: (file: Blob, options?: ConfigSetting) => Promise<string>;
    deleteMedia: (filename: string, options?: ConfigSetting) => Promise<any>;
    immediateUpload?: boolean;
    options?: ConfigSetting;
    constructor(conf: string | CMSStoreConfigSetting, cms: SvelteCMS, contentType: CMSContentType);
}
export declare class CMSFieldFunction {
    id: string;
    fn: (vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, options: {
        [key: string]: any;
    }) => any;
    vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    };
    options: {
        [key: string]: string | number | boolean | null | undefined | CMSFieldTransformer & {
            options?: any;
        } | (string | number | boolean | null | undefined)[];
    };
    constructor(conf: string | CMSFieldFunctionConfig, vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, cms: SvelteCMS);
    run(): void;
}
/**
 * Converts e.g. "points[0].title" to "fields.points.fields.title"
 * @param path string
 */
export declare function getConfigPathFromValuePath(path: string): string;
/**
 * All "Setting" types must fit the pattern of ConfigSetting
 */
export declare type ConfigSetting = {
    [key: string]: string | number | boolean | null | undefined | ConfigSetting | Array<ConfigSetting>;
};
export declare type CMSPlugin = {
    adminPaths?: {
        [path: string]: Object;
    };
    fieldTypes?: CMSFieldType[];
    widgetTypes?: CMSWidgetType[];
    transformers?: CMSFieldTransformer[];
    contentStores?: CMSContentStoreType[];
    mediaStores?: CMSMediaStoreType[];
    lists?: CMSListConfig;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
};
export declare type CMSPluginBuilder = (config: any) => CMSPlugin;
export declare type CMSListConfig = {
    [key: string]: Array<string | number | {
        id: string | number;
        value: any;
    }>;
};
export declare type CMSFieldFunctionType = {
    id: string;
    fn: (vars: {
        field: CMSContentField;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, opts: {
        [key: string]: any;
    }, event?: Event, el?: HTMLElement) => any;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
};
export declare type CMSFieldFunctionConfigParam = (string | number | boolean | null | CMSFieldFunctionConfigSetting)[];
export declare type CMSFieldFunctionConfigSetting = string | {
    function?: string;
    fn?: string;
    params: (string | number | boolean | null | CMSFieldFunctionConfigSetting)[];
};
export declare type CMSStoreConfigSetting = ConfigSetting & {
    id: string;
};
export declare type CMSConfigSetting = {
    adminStore?: string | CMSStoreConfigSetting;
    types?: {
        [key: string]: CMSContentTypeConfigSetting;
    };
    lists?: {
        [key: string]: string | (string | number | {
            id: string | number;
            value: ConfigSetting;
        })[];
    };
    contentStores?: {
        [key: string]: CMSStoreConfigSetting;
    };
    mediaStores?: {
        [key: string]: CMSStoreConfigSetting;
    };
    widgetTypes?: {
        [key: string]: CMSWidgetTypeMerge;
    };
    fieldTypes?: {
        [key: string]: CMSFieldTypeMerge;
    };
    fields?: {
        [key: string]: CMSContentFieldConfigSetting;
    };
    widgets?: {
        [key: string]: CMSWidgetTypeConfigSetting;
    };
    transformers?: {
        [key: string]: CMSFieldTransformerSetting;
    };
};
export declare type CMSContentTypeConfigSetting = {
    label: string;
    fields: {
        [key: string]: string | CMSContentFieldConfigSetting;
    };
    contentStore: string | CMSStoreConfigSetting;
    mediaStore?: string | CMSStoreConfigSetting;
    slug?: string | string[] | CMSSlugConfigSetting;
};
export declare type CMSContentFieldConfigSetting = {
    type: string;
    label?: string;
    default?: any;
    value?: any;
    tooltip?: string;
    required?: boolean | CMSFieldFunctionConfigSetting;
    disabled?: boolean | CMSFieldFunctionConfigSetting;
    hidden?: boolean | CMSFieldFunctionConfigSetting;
    collapsible?: boolean | CMSFieldFunctionConfigSetting;
    collapsed?: boolean | CMSFieldFunctionConfigSetting;
    multiple?: boolean | CMSFieldFunctionConfigSetting | {
        label?: boolean | CMSFieldFunctionConfigSetting;
        min?: number | CMSFieldFunctionConfigSetting;
        max?: number | CMSFieldFunctionConfigSetting;
    };
    multipleLabel?: string | CMSFieldFunctionConfigSetting;
    multipleMin?: number | CMSFieldFunctionConfigSetting;
    multipleMax?: number | CMSFieldFunctionConfigSetting;
    fields?: {
        [key: string]: string | CMSContentFieldConfigSetting;
    };
    widget?: string | CMSWidgetTypeConfigSetting;
    widgetOptions?: ConfigSetting;
    validator?: Rules;
    preSave?: string | CMSFieldTransformerSetting | (string | CMSFieldTransformerSetting)[];
    preMount?: string | CMSFieldTransformerSetting | (string | CMSFieldTransformerSetting)[];
    class?: string;
    events?: {
        on: string;
        function: CMSFieldFunctionConfigSetting;
    } | {
        on: string;
        function: CMSFieldFunctionConfigSetting;
    }[];
    mediaStore?: string | CMSStoreConfigSetting;
};
export declare type CMSConfigFieldConfigSetting = CMSContentFieldConfigSetting & {
    type: 'text' | 'number' | 'boolean' | 'date' | 'collection' | 'tags' | 'cmsField' | 'cmsTransformer' | 'cmsFunction';
    default: any;
    fields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
};
export declare type CMSMedia = {
    src: string;
    alt?: string;
    title?: string;
};
export declare type CMSContentStoreType = {
    id: string;
    listContent?: (contentType: CMSContentType, opts: ConfigSetting) => Promise<any[]>;
    getContent?: (contentType: CMSContentType, opts: ConfigSetting, slug?: string | number) => Promise<any | any[]>;
    saveContent?: (content: any, contentType: CMSContentType, opts: ConfigSetting) => Promise<any>;
    deleteContent?: (content: any, contentType: CMSContentType, opts: ConfigSetting) => Promise<any>;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
    options?: ConfigSetting;
};
export declare type CMSMediaStoreType = {
    id: string;
    listMedia?: (path: string | null, opts: ConfigSetting) => Promise<string[]>;
    getMedia?: (filename: string | number | null, opts: ConfigSetting) => Promise<string | string[]>;
    saveMedia?: (file: File, opts: ConfigSetting) => Promise<string>;
    deleteMedia?: (filename: string, opts: ConfigSetting) => Promise<any>;
    immediateUpload?: boolean;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
    options?: ConfigSetting;
};
export declare type CMSFieldType = {
    id: string;
    defaultValue: any;
    defaultWidget: string | CMSWidgetTypeConfigSetting;
    defaultValidator?: Rules;
    defaultPreSave?: Array<string | CMSFieldTransformerSetting>;
    defaultPreMount?: Array<string | CMSFieldTransformerSetting>;
    hidden?: boolean;
};
export declare type CMSFieldTypeMerge = CMSFieldType & {
    id?: string;
    type?: string;
    defaultValue?: any;
    defaultWidget?: string;
};
export declare type FormDataHandler = (value: {
    [key: string]: any;
}, cms: SvelteCMS, contentType: CMSContentType, field: CMSContentField) => Promise<any>;
export declare type CMSWidgetType = {
    id: string;
    widget: Object;
    fieldTypes: string[];
    handlesMultiple?: boolean;
    handlesMedia?: boolean;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
    hidden?: boolean;
    formDataHandler?: FormDataHandler;
};
export declare type CMSWidgetTypeMerge = CMSWidgetType & {
    id?: string;
    type?: string;
    fieldTypes?: string[];
};
export declare type CMSWidgetTypeConfigSetting = {
    id: string;
    options: ConfigSetting;
};
export declare type CMSFieldTransformer = {
    id: string;
    fn: (value: any, opts: ConfigSetting, fieldConf: CMSFieldType) => any;
    optionFields?: {
        [key: string]: CMSConfigFieldConfigSetting;
    };
    [key: string]: any;
};
export declare type CMSFieldTransformerSetting = {
    id: string;
    options: ConfigSetting;
};
