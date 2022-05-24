import type SvelteCMS from "sveltecms";
import type { ConfigSetting, TypedEntityConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType, ConfigurableEntity } from "sveltecms";
import type ContentType from "sveltecms/core/ContentType";
import type Field from "sveltecms/core/Field";
export declare type FormDataHandler = (value: {
    [key: string]: any;
}, cms: SvelteCMS, contentType: ContentType, field: Field) => Promise<any>;
export declare type WidgetConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {};
export declare type WidgetType = ConfigurableEntityType & {
    widget: Object;
    fieldTypes: string[];
    handlesMultiple?: boolean;
    handlesMedia?: boolean;
    isFieldable?: boolean;
    admin?: boolean;
    formDataHandler?: FormDataHandler;
};
export declare class Widget implements ConfigurableEntity {
    type: string;
    widget: Object;
    handlesMultiple: boolean;
    handlesMedia: boolean;
    isFieldable: boolean;
    options?: ConfigSetting;
    formDataHandler?: FormDataHandler;
    constructor(conf: string | WidgetConfigSetting, cms: SvelteCMS);
}
export declare const widgetTypes: {
    [key: string]: WidgetType;
};
export default Widget;
