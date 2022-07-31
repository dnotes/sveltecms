import type SvelteCMS from 'sveltecms';
import type { ConfigSetting, ConfigurableEntity, ConfigurableEntityConfigSetting, ConfigurableEntityType, EntityType, TypedEntity, TypedEntityConfigSetting } from 'sveltecms';
import type { ContentType } from 'sveltecms/core/ContentType';
import type { EntityTemplate } from 'sveltecms/core/EntityTemplate';
export declare type Value = string | number | boolean | null | undefined | Date | Content | Array<Value>;
export declare type Content = {
    _type?: string;
    _slug?: string;
    _oldSlug?: string;
    [id: string]: Value;
};
export declare type ContentStoreType = EntityType & ConfigurableEntityType & {
    listContent?: (contentType: ContentType, opts: ConfigSetting) => Promise<Content[]>;
    getContent?: (contentType: ContentType, opts: ConfigSetting, slug?: string | number) => Promise<Content | Content[]>;
    saveContent?: (content: Content, contentType: ContentType, opts: ConfigSetting) => Promise<Content>;
    deleteContent?: (content: Content, contentType: ContentType, opts: ConfigSetting) => Promise<Content>;
};
export declare type ContentStoreConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting;
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
