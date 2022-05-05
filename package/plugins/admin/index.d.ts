import type { CMSConfigFieldConfigSetting, CollectionConfigSetting, ConfigSetting } from 'sveltecms';
export declare type AdminPath = {
    id: string;
    component: Object;
    configPath?: string;
    title?: string;
    fields?: {
        [id: string]: string | CMSConfigFieldConfigSetting;
    };
    options?: ConfigSetting;
};
export declare const adminPaths: AdminPath[];
export declare const collections: CollectionConfigSetting[];
declare const _default: {
    adminPaths: AdminPath[];
    collections: CollectionConfigSetting[];
};
export default _default;
