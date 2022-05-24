import type SvelteCMS from 'sveltecms';
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms';
export declare type MediaStoreType = EntityType & ConfigurableEntityType & {
    listMedia?: (path: string | null, opts: ConfigSetting) => Promise<string[]>;
    getMedia?: (filename: string | number | null, opts: ConfigSetting) => Promise<string | string[]>;
    saveMedia?: (file: File, opts: ConfigSetting) => Promise<string>;
    deleteMedia?: (filename: string, opts: ConfigSetting) => Promise<any>;
    immediateUpload?: boolean;
};
export declare type MediaStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
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
