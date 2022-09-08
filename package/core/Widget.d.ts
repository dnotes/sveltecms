import type SvelteCMS from "..";
import type { ConfigSetting, TypedEntityConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType, ConfigurableEntity } from "..";
import type ContentType from "./ContentType";
import type Field from "./Field";
import type { EntityTemplate } from "./EntityTemplate";
export declare type FormDataHandler = (value: {
    [key: string]: any;
}, cms: SvelteCMS, contentType: ContentType, field: Field) => Promise<any>;
export declare type WidgetConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {};
export declare const templateWidget: EntityTemplate;
export declare type WidgetType = ConfigurableEntityType & {
    description: string;
    widget: Object;
    fieldTypes: string[];
    handlesMultiple?: boolean;
    handlesMedia?: boolean;
    handlesFields?: boolean;
    admin?: boolean;
    formDataHandler?: FormDataHandler;
};
export declare class Widget implements ConfigurableEntity {
    type: string;
    widget: Object;
    handlesMultiple: boolean;
    handlesMedia: boolean;
    handlesFields: boolean;
    options?: ConfigSetting;
    formDataHandler?: FormDataHandler;
    constructor(conf: string | WidgetConfigSetting, cms: SvelteCMS);
}
export declare const widgetTypes: {
    [key: string]: WidgetType;
};
export default Widget;
