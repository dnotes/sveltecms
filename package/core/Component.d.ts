import type SvelteCMS from "sveltecms";
import type { ConfigurableEntityConfigSetting, ConfigurableEntityType, TypedEntityConfigSetting, ConfigurableEntity, ConfigSetting, TypedEntity, EntityType } from "sveltecms";
export declare type ComponentType = EntityType & ConfigurableEntityType & {
    component: Object;
};
export declare type ComponentConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
export declare class Component implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    component: Object;
    plugin?: string;
    options?: ConfigSetting;
    constructor(conf: string | ComponentConfigSetting, cms: SvelteCMS);
}
export default Component;
