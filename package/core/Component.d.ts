import type SvelteCMS from "..";
import type { ConfigurableEntityConfigSetting, ConfigurableEntityType, TypedEntityConfigSetting, ConfigurableEntity, ConfigSetting, TypedEntity, EntityType } from "..";
import type { EntityTemplate } from "./EntityTemplate";
/**
 * Note: Components must be pre-registered for ANY type of import in SvelteKit.
 * Dynamic import() cannot be used with a variable in the import string; this
 * is a limitation of the bundler. See https://github.com/sveltejs/svelte/issues/6702.
 */
export declare const templateComponent: EntityTemplate;
export declare type ComponentType = EntityType & ConfigurableEntityType & {
    admin?: true;
    component: Object;
};
export declare type ComponentConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
export declare class Component implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    component: Object;
    admin?: true;
    plugin?: string;
    options?: ConfigSetting;
    constructor(conf: string | ComponentConfigSetting, cms: SvelteCMS);
}
export default Component;
