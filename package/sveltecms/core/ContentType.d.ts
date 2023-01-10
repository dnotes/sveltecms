import type SvelteCMS from '../..';
import type { ConfigSetting, DisplayableEntity, DisplayableEntityConfigSetting, FieldableEntity, LabeledEntity } from '../..';
import { SlugConfig, type SlugConfigSetting } from '../../core/Slug';
import { ContentStore, type ContentStoreConfigSetting } from '../../core/ContentStore';
import type { MediaStoreConfigSetting } from '../../core/MediaStore';
import Field, { type FieldConfigSetting } from '../../core/Field';
import type { EntityTemplate } from '../../core/EntityTemplate';
import type { EntityDisplayConfigSetting } from './Display';
export declare const templateContentType: EntityTemplate;
export type ContentTypeConfigSetting = ConfigSetting & DisplayableEntityConfigSetting & {
    label?: string;
    fields: {
        [id: string]: string | FieldConfigSetting;
    };
    contentStore: string | ContentStoreConfigSetting;
    mediaStore?: string | MediaStoreConfigSetting;
    slug?: string | string[] | SlugConfigSetting;
    form?: {
        method?: 'post' | 'get';
        action?: string;
    };
};
export declare class ContentType implements FieldableEntity, LabeledEntity, DisplayableEntity {
    id: string;
    label: string;
    isFieldable: boolean;
    slug: SlugConfig;
    contentStore: ContentStore;
    mediaStore?: string | MediaStoreConfigSetting;
    displays: EntityDisplayConfigSetting;
    indexFields: string[];
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
