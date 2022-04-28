import type { CMSConfigFieldConfigSetting } from 'sveltecms';
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
export declare type AdminFieldCollectionSetting = {
    id: string;
    fields: {
        [id: string]: CMSConfigFieldConfigSetting;
    };
    allowString?: true;
};
export declare const adminFieldCollections: AdminFieldCollectionSetting[];
declare const _default: {
    adminPaths: AdminPath[];
    adminFieldCollections: AdminFieldCollectionSetting[];
};
export default _default;
