import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms';
import type SvelteCMS from 'sveltecms';
import type { Content } from './ContentStore';
import type ContentType from './ContentType';
import type { EntityTemplate } from './EntityTemplate';
import type { Media } from './MediaStore';
export declare type IndexItem = Content;
export declare type IndexerType = EntityType & ConfigurableEntityType & {
    saveContent: (contentType: ContentType, content: IndexItem | IndexItem[]) => Promise<void>;
    deleteContent: (contentType: ContentType, content: IndexItem | IndexItem[]) => Promise<void>;
    saveMedia: (media: Media | Media[]) => Promise<void>;
    deleteMedia: (media: Media | Media[]) => Promise<void>;
    searchContent: (contentType: ContentType, search: string | Object, options?: Object) => Promise<Content & {
        _score?: number;
    }[]>;
    searchMedia: (search: string | Object, options?: Object) => Promise<Media & {
        _score?: number;
    }[]>;
};
export declare const templateIndexer: EntityTemplate;
export declare type IndexerConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {
    mediaKeys?: string | string[];
};
export declare class Indexer implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    saveContent: (contentType: ContentType, content: Content | Content[]) => Promise<void>;
    deleteContent: (contentType: ContentType, content: Content | Content[]) => Promise<void>;
    saveMedia: (media: Media | Media[]) => Promise<void>;
    deleteMedia: (media: Media | Media[]) => Promise<void>;
    searchContent: (contentType: ContentType, search: string | Object, options?: Object) => Promise<Content[]>;
    searchMedia: (search: string | Object, options?: Object) => Promise<Media[]>;
    mediaKeys: string[];
    options: ConfigSetting;
    constructor(conf: string | IndexerConfigSetting, cms: SvelteCMS);
}
export default Indexer;
