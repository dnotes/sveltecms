import type { FieldableEntityConfigSetting, EntityType, FieldableEntity } from "sveltecms";
import type SvelteCMS from "sveltecms";
import Field from "./Field";
export declare type CollectionConfigSetting = FieldableEntityConfigSetting & EntityType & {
    admin?: boolean;
};
export declare type AdminCollectionConfigSetting = CollectionConfigSetting & {
    admin: true;
};
export declare class Collection implements EntityType, FieldableEntity {
    id: string;
    type: string;
    admin?: boolean;
    plugin?: string;
    isFieldable: boolean;
    fields: {
        [id: string]: Field;
    };
    constructor(conf: CollectionConfigSetting, cms: SvelteCMS);
}
export declare type AdminCollection = Collection & {
    admin: true;
};
export declare const collectionTypes: {
    id: string;
    fields: {};
}[];
export default Collection;
