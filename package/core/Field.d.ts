import type SvelteCMS from '..';
import type { LabeledEntity, TypedEntity, EntityType, ConfigSetting, FieldableEntity, DisplayableEntityConfigSetting, DisplayableEntity, DisplayableEntityType } from "..";
import type { TransformerConfigSetting } from "./Transformer";
import type ContentType from './ContentType';
import MediaStore, { type MediaStoreConfigSetting } from "./MediaStore";
import { type ScriptFunctionConfigSetting, ScriptFunctionConfig } from './ScriptFunction';
import Widget, { type WidgetConfigSetting } from './Widget';
import type { EntityDisplayConfigSetting } from './Display';
import type { EntityTemplate } from './EntityTemplate';
import type { Component } from './Component';
export type FieldConfigSetting = DisplayableEntityConfigSetting & {
    type: string;
    label?: string | ScriptFunctionConfigSetting;
    index?: boolean | ScriptFunctionConfigSetting;
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
export type ConfigFieldConfigSetting = Omit<FieldConfigSetting, "display|displayModes"> & {
    type: 'text' | 'number' | 'boolean' | 'date' | 'fieldgroup' | 'entity' | 'entityList' | 'list';
    entity?: string;
    default: any;
    helptext: string;
    fields?: {
        [key: string]: ConfigFieldConfigSetting;
    };
};
export type FieldType = EntityType & DisplayableEntityType & {
    default: any;
    widget: string | WidgetConfigSetting;
    preSave?: Array<string | TransformerConfigSetting>;
    preMount?: Array<string | TransformerConfigSetting>;
    multiple?: boolean;
    admin?: boolean;
};
export declare const templateField: EntityTemplate;
export declare class Field implements FieldableEntity, TypedEntity, LabeledEntity, DisplayableEntity {
    id: string;
    type: string;
    label: string | ScriptFunctionConfig;
    helptext?: string | ScriptFunctionConfig;
    required?: boolean | ScriptFunctionConfig;
    disabled?: boolean | ScriptFunctionConfig;
    index?: boolean | ScriptFunctionConfig;
    hidden?: boolean | ScriptFunctionConfig;
    class: string | ScriptFunctionConfig;
    default?: any;
    value?: any;
    events?: {
        on: string;
        function: ScriptFunctionConfig;
    }[];
    displayComponent?: Component;
    multiple?: boolean | ScriptFunctionConfig | ScriptFunctionConfigSetting;
    multipleOrSingle?: boolean;
    multipleLabelFields?: string | string[] | ScriptFunctionConfig;
    multipleMin?: number | ScriptFunctionConfig;
    multipleMax?: number | ScriptFunctionConfig;
    fields?: {
        [key: string]: Field;
    };
    widget: Widget;
    displays: EntityDisplayConfigSetting;
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
