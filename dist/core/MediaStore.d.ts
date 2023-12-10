import type SvelteCMS from '..';
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from '..';
import type { Value } from './ContentStore';
import type { EntityTemplate } from './EntityTemplate';
import type { AdminFieldgroupConfigSetting } from './Fieldgroup';
export type Media = {
    src: string;
    _meta?: MediaMetadata;
    [fieldname: string]: Value;
};
export type MediaMetadata = {
    name?: string;
    type?: string;
    date?: Date;
    size?: number;
    [key: string]: Value;
};
export type MediaIndex = {
    usage: string;
    value: Media;
}[];
export type MediaStoreType = EntityType & ConfigurableEntityType & {
    listMedia?: (path: string | null, opts: ConfigSetting) => Promise<string[]>;
    getMedia?: (filename: string | number | null, opts: ConfigSetting) => Promise<string | string[]>;
    saveMedia?: (file: File, opts: ConfigSetting) => Promise<string>;
    deleteMedia?: (filename: string, opts: ConfigSetting) => Promise<any>;
    immediateUpload?: boolean;
};
export type MediaStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
export declare const templateMediaStore: EntityTemplate;
export declare const mediaMetaFields: AdminFieldgroupConfigSetting;
export declare class MediaStore implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    listMedia: (path?: string | null, options?: ConfigSetting) => Promise<string[]>;
    getMedia: (filename?: string | number | null, options?: ConfigSetting) => Promise<string | string[]>;
    saveMedia: (file: Blob, options?: ConfigSetting) => Promise<string>;
    deleteMedia: (filename: string, options?: ConfigSetting) => Promise<any>;
    immediateUpload: boolean;
    options: ConfigSetting;
    constructor(conf: string | MediaStoreConfigSetting, cms: SvelteCMS);
}
export default MediaStore;
