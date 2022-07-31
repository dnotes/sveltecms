import type { Component, ComponentType } from "sveltecms/core/Component";
import type { ConfigurableEntityConfigSetting } from "sveltecms";
import type SvelteCMS from "sveltecms";
import type { EntityTemplate } from "./EntityTemplate";
export declare type DisplayConfigSetting = ConfigurableEntityConfigSetting & {
    type: string;
    wrapper?: string;
    html?: boolean;
    link?: boolean;
};
export declare const templateDisplay: EntityTemplate;
export declare class Display {
    type: string;
    isDisplayed: boolean;
    link: boolean;
    component?: Component;
    wrapper?: Display;
    html?: boolean;
    tag?: string;
    id?: string;
    classes?: string[];
    constructor(conf: string | false | undefined | DisplayConfigSetting, cms: SvelteCMS);
    get classList(): string;
}
export declare const displayComponents: ComponentType[];
export default Display;
