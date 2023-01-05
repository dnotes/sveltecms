import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "sveltecms";

import slugify from '@sindresorhus/slugify'
import type { EntityTemplate } from "./EntityTemplate";

export type TransformerConfigSetting = ConfigurableEntityConfigSetting

export const templateTransformer:EntityTemplate = {
  id: 'transformer',
  label: 'Transformer',
  labelPlural: 'Transformers',
  description: `Transformers modify a Field's data before saving to the database (preSave) or displaying in the browser (preMount).`,
  typeField: true,
  typeInherits: true,
  typeRestricted: true,
  isConfigurable: true,
}

export type Transformer = ConfigurableEntityType & {
  description:string
  fn:(value:any, opts?:ConfigSetting) => any
}

export const transformers:{[id:string]:Transformer} = {
  toString: {
    id: 'toString',
    description: 'Converts a Field value to a string.',
    fn: (v) => v?.toString()
  },
  date: {
    id: 'date',
    description: 'Converts a Field value to a Date.',
    fn: (v) => new Date(v)
  },
  removeTimestamp: {
    id: 'removeTimestamp',
    description: 'Removes the timestamp from a Date field value.',
    fn: (v) => {
      v = v instanceof Date ? v.toISOString() : v
      return typeof v === 'string' ? v?.replace(/(T| )\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|(-|\+)\d{2}:?\d{2})/g, '') : v
    },
  },
  // dateFormat: {
  //   id: 'dateFormat',
  //   fn: (v,opts) => {
  //     v = new Date(v)
  //     return v.toLocaleDateString(opts.locale, opts.dateFormatOptions)
  //   },
  //   optionFields: {
  //     locale: {
  //       type: 'text',
  //       default: '',
  //       helptext: "The locale to display the date, e.g. 'en-US', or empty to display in client's locale."
  //     },
  //     dateFormatOptions: {
  //       type: 'fieldgroup',
  //       default: {},
  //       fields: {
  //         timeZone: {
  //           type: 'text',
  //           default: '',
  //         },
  //       }
  //     }
  //   }
  // },
  boolean: {
    id: 'boolean',
    description: 'Converts a Field value to Boolean.',
    fn: (v) => Boolean(v)
  },
  parseInt: {
    id: 'parseInt',
    description: 'Converts a Field value to a number using parseInt.',
    fn: (v) => {
      let value = parseInt(v)
      return Number.isNaN(value) ? undefined : value
    }
  },
  parseFloat: {
    id: 'parseFloat',
    description: 'Converts a Field value to a number using parseFloat.',
    fn: (v) => {
      let value = parseFloat(v)
      return Number.isNaN(value) ? undefined : value
    }
  },
  delete: {
    id: 'delete',
    description: 'Removes a Field value from the Fieldgroup or Content Type.',
    fn: (v) => { return undefined }
  },
  tags: {
    id: 'tags',
    description: 'Converts a text Field value to an array of strings, like tags.',
    fn: function parseTags(v,opts) {
      let regex = opts.splitOnSpaces ? new RegExp(`(?:\s|${opts.delimiter})+`, 'g') : new RegExp(`${opts.delimiter}`, 'g')
      let items = v?.toString()?.split(regex) || v
      if (Array.isArray(items) && opts.trimItems) items = items.map(i => i.trim())
      return items
    },
    optionFields: {
      delimiter: {
        type: 'text',
        default: ',',
        helptext: 'The delimiter between tags.',
      },
      splitOnSpaces: {
        type: 'boolean',
        helptext: 'If true, any space will also function as a delimiter between tags.',
        default: false,
      },
      trimItems: {
        type: 'boolean',
        helptext: 'Whether to trim spaces around tags. ' +
          'Only set to false if it is necessary to begin or end tags with a space character. ' +
          'Does nothing if "Split On Spaces" is false.',
        default: true,
        hidden: '$values.splitOnSpaces'
      },
    },
  },
  slugify: {
    id: 'slugify',
    description: 'Converts a Field value to a slugified string.',
    fn: (v,opts) => {
      if (Array.isArray(opts?.customReplacements) && opts.customReplacements.length) {
        // @ts-ignore
        opts.customReplacements = opts.customReplacements.map(pair => {
          // @ts-ignore TODO why does it think this isn't possible? something about changing ConfigSetting type?
          if (typeof pair === 'string') return pair.split(':').map(i => i ?? '')
          return ['','']
        })
      }
      return slugify(v.toString(), opts)
    },
    optionFields: {
      separator: {
        type: "text",
        helptext: 'The separator character to subsitute for spaces, etc.',
        default: '-',
      },
      lowercase: {
        type: 'boolean',
        helptext: 'Make the slug lowercase.',
        default: true,
      },
      decamelize: {
        type: 'boolean',
        helptext: 'Convert camelcase to separate words, e.g. fooBar > foo-bar.',
        default: true,
      },
      customReplacements: {
        type: 'text',
        multiple: true,
        default: [],
        widget: 'multiselect',
        helptext: `Add your own custom replacements. `+
          `The replacements are run on the original string before any other transformations. `+
          `The format is "from:to,from2:to2,...". To remove a character, use "from:". `+
          `Add a leading and trailing space to the replacement to have it separated by dashes, e.g. "@: at ,...".`,
      },
      preserveLeadingUnderscore: {
        type: 'boolean',
        helptext: `If your string starts with an underscore, it will be preserved in the slug.`,
        default: false,
      },
      preserveTrailingDash: {
        type: 'boolean',
        helptext: `If your string ends with a dash, it will be preserved in the slug.`,
        default: false,
      },
    }
  },
  getFilename: {
    id: 'getFilename',
    description: 'Gets a filename from a Field value; useful for Fields that handle media.',
    fn: (v) => {
      return v.replace(/.+\//, '').replace(/\.[^\.]*$/, '')
    }
  }
}

export default Transformer
