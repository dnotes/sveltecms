import { type RequestEvent } from "@sveltejs/kit";
import type SvelteCMS from "../..";
import { Component, type ComponentConfigSetting } from "../../core/Component";
import type { Content } from "./ContentStore";
import type { EntityTemplate } from "./EntityTemplate";
export declare const templateAdminPage: EntityTemplate;
export type AdminPageConfig = {
    id: string;
    component: string | ComponentConfigSetting;
    label?: string | (string | undefined | false)[];
    GET?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
    }) => Promise<any>;
    POST?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Content;
    }) => Promise<any>;
    DELETE?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Content;
    }) => Promise<any>;
};
export declare class AdminPage {
    id: string;
    component: Component;
    label: (string | undefined | false)[];
    GET?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
    }) => Promise<any>;
    POST?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Content;
    }) => Promise<any>;
    DELETE?: (data: {
        cms: SvelteCMS;
        args: string[];
        event?: RequestEvent;
        values?: Content;
    }) => Promise<any>;
    constructor(conf: AdminPageConfig, cms: SvelteCMS);
}
export declare const adminPages: AdminPageConfig[];
