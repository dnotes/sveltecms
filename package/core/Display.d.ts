import type { ComponentType } from "sveltecms/core/Component";
import type { ConfigurableEntityConfigSetting } from "sveltecms";
import type SvelteCMS from "sveltecms";
import type { EntityTemplate } from "./EntityTemplate";
export declare type DisplayConfigSetting = ConfigurableEntityConfigSetting & {
    type: string;
    wrapper?: string;
    html?: boolean;
};
export declare const templateDisplay: EntityTemplate;
export declare class DisplayConfig {
    type: string;
    isComponent: boolean;
    wrapper?: DisplayConfig;
    html?: boolean;
    constructor(conf: false | string | DisplayConfigSetting, cms: SvelteCMS);
}
export declare const displayComponents: ComponentType[];
