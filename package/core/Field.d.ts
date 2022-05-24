import type SvelteCMS from 'sveltecms';
import type { LabeledEntity, TypedEntity, EntityType, FieldableEntity } from "sveltecms";
import type { TransformerConfigSetting } from "sveltecms/core/Transformer";
import type ContentType from 'sveltecms/core/ContentType';
import MediaStore, { type MediaStoreConfigSetting } from "sveltecms/core/MediaStore";
import { type ScriptFunctionConfigSetting, ScriptFunctionConfig } from 'sveltecms/core/ScriptFunction';
import Widget, { type WidgetConfigSetting } from 'sveltecms/core/Widget';
export declare type FieldConfigSetting = {
    type: string;
    label?: string | ScriptFunctionConfigSetting;
    default?: any;
    value?: any;
    helptext?: string | ScriptFunctionConfigSetting;
    required?: boolean | ScriptFunctionConfigSetting;
    disabled?: boolean | ScriptFunctionConfigSetting;
    hidden?: boolean | ScriptFunctionConfigSetting;
    multiple?: boolean | ScriptFunctionConfigSetting;
    multipleLabel?: string | ScriptFunctionConfigSetting;
    multipleMin?: number | ScriptFunctionConfigSetting;
    multipleMax?: number | ScriptFunctionConfigSetting;
    fields?: {
        [key: string]: string | FieldConfigSetting;
    };
    widget?: string | WidgetConfigSetting;
    preSave?: string | TransformerConfigSetting | (string | TransformerConfigSetting)[];
    preMount?: string | TransformerConfigSetting | (string | TransformerConfigSetting)[];
    class?: string;
    events?: {
        on: string;
        function: ScriptFunctionConfigSetting;
    } | {
        on: string;
        function: ScriptFunctionConfigSetting;
    }[];
    mediaStore?: string | MediaStoreConfigSetting;
};
export declare type ConfigFieldConfigSetting = FieldConfigSetting & {
    type: 'text' | 'number' | 'boolean' | 'date' | 'collection' | 'tags';
    default: any;
    helptext: string;
    fields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
};
export declare type FieldType = EntityType & {
    default: any;
    widget: string | WidgetConfigSetting;
    preSave?: Array<string | TransformerConfigSetting>;
    preMount?: Array<string | TransformerConfigSetting>;
    admin?: boolean;
};
export declare class Field implements FieldableEntity, TypedEntity, LabeledEntity {
    id: string;
    type: string;
    label: string | ScriptFunctionConfig;
    helptext?: string | ScriptFunctionConfig;
    required?: boolean | ScriptFunctionConfig;
    disabled?: boolean | ScriptFunctionConfig;
    hidden?: boolean | ScriptFunctionConfig;
    class: string | ScriptFunctionConfig;
    default?: any;
    value?: any;
    events?: {
        on: string;
        function: ScriptFunctionConfig;
    }[];
    multiple?: boolean | ScriptFunctionConfig;
    multipleLabel?: boolean | ScriptFunctionConfig;
    multipleMin?: number | ScriptFunctionConfig;
    multipleMax?: number | ScriptFunctionConfig;
    fields?: {
        [key: string]: Field;
    };
    widget: Widget;
    preSave?: (string | TransformerConfigSetting)[];
    preMount?: (string | TransformerConfigSetting)[];
    mediaStore?: MediaStore;
    values: {
        [key: string]: any;
    };
    errors: {
        [key: string]: any;
    };
    touched: {
        [key: string]: any;
    };
    constructor(id: any, conf: string | FieldConfigSetting, cms: SvelteCMS, contentType?: ContentType);
    get isFieldable(): boolean;
}
export declare const fieldTypes: {
    [key: string]: FieldType;
};
export default Field;
