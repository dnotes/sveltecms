import type { Component, ComponentType } from "sveltecms/core/Component";
import type SvelteCMS from "sveltecms";
import type { EntityTemplate } from "./EntityTemplate";
export declare type DisplayConfig = {
    type: string;
    wrapper?: string;
    label?: string;
    html?: boolean;
    link?: boolean;
};
export declare function isDisplayConfig(item: DisplayConfig | any): item is DisplayConfig;
export declare type DisplayConfigSetting = string | DisplayConfig;
export declare type EntityDisplayConfigSetting = DisplayConfigSetting | {
    [id: string]: DisplayConfigSetting;
};
export declare type EntityDisplayConfig = {
    [id: string]: DisplayConfigSetting;
};
export declare type FullEntityDisplayConfig = EntityDisplayConfig & {
    default: DisplayConfigSetting;
    page: DisplayConfigSetting;
    teaser: DisplayConfigSetting;
    reference: DisplayConfigSetting;
};
export declare const defaultDisplayModes: string[];
export declare const displayNoneKeywords: string[];
export declare function isDisplayNone(conf: any): boolean;
export declare const templateDisplay: EntityTemplate;
export declare class Display {
    type: string;
    isDisplayed: boolean;
    link: boolean;
    component?: Component;
    wrapper?: Display;
    label?: Display;
    html?: boolean;
    tag?: string;
    id?: string;
    classes?: string[];
    constructor(conf: DisplayConfigSetting, cms: SvelteCMS);
    get classList(): string;
}
export declare const displayComponents: ComponentType[];
export default Display;
