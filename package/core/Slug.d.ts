import type SvelteCMS from '..';
import type { ConfigSetting, ConfigurableEntityConfigSettingValue } from '..';
import type { TransformerConfigSetting } from './Transformer';
import type { EntityTemplate } from './EntityTemplate';
export interface SlugConfigSetting extends ConfigSetting {
    fields: string | string[];
    separator?: string;
    slugify?: ConfigurableEntityConfigSettingValue<TransformerConfigSetting>;
}
export declare const templateSlug: EntityTemplate;
export declare class SlugConfig {
    fields: string[];
    separator: string;
    slugify: ConfigurableEntityConfigSettingValue<TransformerConfigSetting>;
    constructor(conf: string | string[] | SlugConfigSetting, cms: SvelteCMS);
}
export default SlugConfig;
