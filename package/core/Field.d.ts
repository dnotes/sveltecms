import type SvelteCMS from 'sveltecms';
import type { LabeledEntity, TypedEntity, EntityType, ConfigSetting, FieldableEntity } from "sveltecms";
import type { TransformerConfigSetting } from "sveltecms/core/Transformer";
import type ContentType from 'sveltecms/core/ContentType';
import MediaStore, { type MediaStoreConfigSetting } from "sveltecms/core/MediaStore";
import { type ScriptFunctionConfigSetting, ScriptFunctionConfig } from 'sveltecms/core/ScriptFunction';
import Widget, { type WidgetConfigSetting } from 'sveltecms/core/Widget';
import { DisplayConfig, type DisplayConfigSetting } from './Display';
import { Entity, type EntityTemplate } from './EntityTemplate';
export declare type FieldConfigSetting = {
    type: string;
    label?: string | ScriptFunctionConfigSetting;
    default?: any;
    helptext?: string | ScriptFunctionConfigSetting;
    required?: boolean | ScriptFunctionConfigSetting;
    disabled?: boolean | ScriptFunctionConfigSetting;
    hidden?: boolean | ScriptFunctionConfigSetting;
    multiple?: boolean | ScriptFunctionConfigSetting;
    multipleOrSingle?: boolean;
    multipleLabelFields?: string | string[] | ScriptFunctionConfigSetting;
    fields?: {
        [key: string]: string | FieldConfigSetting;
    };
    widget?: string | WidgetConfigSetting;
    display?: string | false | DisplayConfigSetting;
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
    [id: string]: string | number | boolean | ConfigSetting | ScriptFunctionConfigSetting | (string | number | ConfigSetting)[];
};
export declare type ConfigFieldConfigSetting = FieldConfigSetting & {
    type: 'text' | 'number' | 'boolean' | 'date' | 'fieldgroup' | 'tags' | 'entity' | 'entityList';
    entity?: string;
    default: any;
    helptext: string;
    fields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
};
export declare type FieldType = EntityType & {
    default: any;
    widget: string | WidgetConfigSetting;
    display: string | DisplayConfigSetting;
    preSave?: Array<string | TransformerConfigSetting>;
    preMount?: Array<string | TransformerConfigSetting>;
    admin?: boolean;
};
export declare const templateField: EntityTemplate;
export declare class Field extends Entity implements FieldableEntity, TypedEntity, LabeledEntity {
    id: string;
    type: string;
    template: EntityTemplate;
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
    multipleOrSingle?: boolean;
    multipleLabelFields?: string | string[] | ScriptFunctionConfig;
    multipleMin?: number | ScriptFunctionConfig;
    multipleMax?: number | ScriptFunctionConfig;
    fields?: {
        [key: string]: Field;
    };
    widget: Widget;
    display?: DisplayConfig;
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
