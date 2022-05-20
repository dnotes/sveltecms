import type SvelteCMS from 'sveltecms'
import type { ConfigSetting, ConfigurableEntityConfigSettingValue } from 'sveltecms'
import type { TransformerConfigSetting } from 'sveltecms/core/Transformer'

import { splitTags } from 'sveltecms/utils'
const split = splitTags()

export interface SlugConfigSetting extends ConfigSetting {
  fields: string|string[]
  separator?: string
  slugify?: ConfigurableEntityConfigSettingValue<TransformerConfigSetting>
}

export class SlugConfig {
  fields:string[]
  separator: string = '-'
  slugify: ConfigurableEntityConfigSettingValue<TransformerConfigSetting> = ['removeTimestamp', 'slugify']
  constructor(conf:string|string[]|SlugConfigSetting, cms:SvelteCMS) {
    if (typeof conf === 'string') {
      this.fields = split(conf)
    }
    else if (Array.isArray(conf)) {
      this.fields = conf
    }
    else {
      this.fields = typeof conf.fields === 'string' ? split(conf.fields) : conf.fields
      if (conf.slugify) this.slugify = conf.slugify
    }
    return this
  }
}

export default SlugConfig