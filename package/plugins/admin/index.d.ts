import type { CMSConfigFieldConfigSetting, CollectionConfigSetting } from 'sveltecms';
export declare type AdminPath = {
    id: string;
    component: Object;
    configPath?: string;
    fieldCollection?: string;
    title?: string;
    fields?: {
        [id: string]: string | CMSConfigFieldConfigSetting;
    };
};
export declare const adminPaths: AdminPath[];
export declare const collections: CollectionConfigSetting[];
declare const _default: {
    adminPaths: AdminPath[];
    collections: CollectionConfigSetting[];
};
export default _default;
