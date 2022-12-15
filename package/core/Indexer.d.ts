import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from '..';
import type SvelteCMS from '..';
import type { Content } from './ContentStore';
import type ContentType from './ContentType';
import type { EntityTemplate } from './EntityTemplate';
import type { Media } from './MediaStore';
export type IndexItem = Content;
export type IndexChange = {
    before?: IndexItem;
    after?: IndexItem;
};
export declare function isIndexItem(item: IndexItem | any): item is IndexItem;
export type IndexerType = EntityType & ConfigurableEntityType & {
    getIndex: (id: string) => Promise<IndexItem[]>;
    updateIndex: (id: string, changes: IndexChange[]) => Promise<void>;
    saveIndex: (id: string, index: IndexItem[]) => Promise<void>;
    searchIndex: (id: string, search?: string, options?: Object) => Promise<(Content | Media) & {
        _score?: number;
    }[]>;
    saveContent: (contentType: string | ContentType, content: IndexItem | IndexItem[]) => Promise<void>;
    deleteContent: (contentType: string | ContentType, content: IndexItem | IndexItem[]) => Promise<void>;
    saveMedia: (media: Media | Media[]) => Promise<void>;
    deleteMedia: (media: Media | Media[]) => Promise<void>;
    searchContent: (contentType: string | ContentType, search: string | Object, options?: Object) => Promise<Content & {
        _score?: number;
    }[]>;
    searchMedia: (search: string | Object, options?: Object) => Promise<Media & {
        _score?: number;
    }[]>;
};
export declare const templateIndexer: EntityTemplate;
export type IndexerConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {
    mediaKeys?: string | string[];
};
export declare class Indexer implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    getIndex: (id: string) => Promise<IndexItem[]>;
    updateIndex: (id: string, changes: IndexChange[]) => Promise<void>;
    saveIndex: (id: string, index: IndexItem | IndexItem[]) => Promise<void>;
    searchIndex: (id: string, search?: string, options?: Object) => Promise<(Content | Media) & {
        _score?: number;
    }[]>;
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
