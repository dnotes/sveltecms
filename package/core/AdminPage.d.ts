import type SvelteCMS from "sveltecms";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import { Component, type ComponentConfigSetting } from "sveltecms/core/Component";
export declare type AdminPageConfig = {
    id: string;
    component: string | ComponentConfigSetting;
    label?: string | (string | undefined | false)[];
    get?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
    }) => Promise<any>;
    post?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Object;
    }) => Promise<any>;
    del?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Object;
    }) => Promise<any>;
};
export declare class AdminPage {
    id: string;
    component: Component;
    label: (string | undefined | false)[];
    get?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
    }) => Promise<any>;
    post?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Object;
    }) => Promise<any>;
    del?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Object;
    }) => Promise<any>;
    constructor(conf: AdminPageConfig, cms: SvelteCMS);
}
export declare const adminPages: AdminPageConfig[];
