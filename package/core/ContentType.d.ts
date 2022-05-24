import type SvelteCMS from 'sveltecms';
import type { ConfigSetting, FieldableEntity, LabeledEntity } from 'sveltecms';
import { SlugConfig, type SlugConfigSetting } from 'sveltecms/core/Slug';
import { ContentStore, type ContentStoreConfigSetting } from 'sveltecms/core/ContentStore';
import type { MediaStoreConfigSetting } from 'sveltecms/core/MediaStore';
import Field, { type FieldConfigSetting } from 'sveltecms/core/Field';
import type { ComponentConfigSetting } from './Component';
export declare type ContentTypeConfigSetting = ConfigSetting & {
    label: string;
    fields: {
        [id: string]: string | FieldConfigSetting;
    };
    contentStore: string | ContentStoreConfigSetting;
    mediaStore?: string | MediaStoreConfigSetting;
    slug?: string | string[] | SlugConfigSetting;
    previewComponent?: string;
    form?: {
        method?: 'post' | 'get';
        action?: string;
    };
};
export declare class ContentType implements FieldableEntity, LabeledEntity {
    id: string;
    label: string;
    isFieldable: boolean;
    slug: SlugConfig;
    contentStore: ContentStore;
    mediaStore?: string | MediaStoreConfigSetting;
    previewComponent?: string | ComponentConfigSetting;
    fields: {
        [key: string]: Field;
    };
    form: {
        method?: 'post' | 'get';
        action?: string;
    };
    constructor(id: any, conf: ContentTypeConfigSetting, cms: SvelteCMS);
}
export default ContentType;
