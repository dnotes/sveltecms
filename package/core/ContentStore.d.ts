import type SvelteCMS from '..';
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from '..';
import type { ContentType } from './ContentType';
import type { EntityTemplate } from './EntityTemplate';
export type Value = string | number | boolean | null | undefined | Date | Content | Array<Value>;
export type Content = {
    _type?: string;
    _slug?: string;
    _oldSlug?: string;
    [id: string]: Value;
};
export type ContentStoreType = EntityType & ConfigurableEntityType & {
    listContent?: (contentType: ContentType, opts: ConfigSetting) => Promise<Content[]>;
    getContent?: (contentType: ContentType, opts: ConfigSetting, slug?: string | number) => Promise<Content | Content[]>;
    saveContent?: (content: Content, contentType: ContentType, opts: ConfigSetting) => Promise<Content>;
    deleteContent?: (content: Content, contentType: ContentType, opts: ConfigSetting) => Promise<Content>;
};
export type ContentStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
export declare const templateContentStore: EntityTemplate;
export declare class ContentStore implements ConfigurableEntity, TypedEntity {
    id: string;
    type: string;
    listContent: (contentType: ContentType, options: ConfigSetting) => Promise<Content[]>;
    getContent: (contentType: ContentType, options: ConfigSetting, slug?: string | number) => Promise<Content | Content[]>;
    saveContent: (content: Content, contentType: ContentType, options: ConfigSetting) => Promise<Content>;
    deleteContent: (content: Content, contentType: ContentType, options: ConfigSetting) => Promise<Content>;
    options: ConfigSetting;
    constructor(conf: string | ContentStoreConfigSetting, cms: SvelteCMS);
}
export default ContentStore;
