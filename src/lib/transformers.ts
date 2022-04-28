import type { CMSFieldTransformer } from '.'
import slugify from '@sindresorhus/slugify'

const transformers:{[id:string]:CMSFieldTransformer} = {
  toString: {
    id: 'toString',
    fn: (v) => v?.toString()
  },
  date: {
    id: 'date',
    fn: (v) => new Date(v)
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
  //       tooltip: "The locale to display the date, e.g. 'en-US', or empty to display in client's locale."
  //     },
  //     dateFormatOptions: {
  //       type: 'collection',
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
    fn: (v) => Boolean(v)
  },
  parseInt: {
    id: 'parseInt',
    fn: (v) => parseInt(v)
  },
  parseFloat: {
    id: 'parseFloat',
    fn: (v) => parseFloat(v)
  },
  delete: {
    id: 'delete',
    fn: (v) => { return undefined }
  },
  tags: {
    id: 'tags',
    fn: function parseTags(v,opts) {
      let regex = opts.splitOnSpaces ? new RegExp(`(?:\s|${opts.delimiter})+`, 'g') : new RegExp(`${opts.delimiter}`, 'g')
      let items = v?.toString()?.split(regex) || v
      if (Array.isArray(items) && opts.trimItems) items = items.map(i => i.trim())
      return items
    },
    optionFields: {
      delimiter: {
        type: 'text',
        default: ','
      },
      splitOnSpaces: {
        type: 'boolean',
        default: false,
      },
      trimItems: {
        type: 'boolean',
        default: true
      },
    },
  },
  slugify: {
    id: 'slugify',
    fn: (v,opts) => {
      if (Array.isArray(opts?.customReplacements) && opts.customReplacements.length) {
        // @ts-ignore
        opts.customReplacements = opts.customReplacements.map(pair => {
          // @ts-ignore TODO why does it think this isn't possible? something about changing ConfigSetting type?
          if (typeof pair === 'string') return pair.split(':').map(i => i ?? '')
          return ['','']
        })
      }
      return slugify(v, opts)
    },
    optionFields: {
      separator: {
        type: "text",
        default: '-',
      },
      lowercase: {
        type: 'boolean',
        default: true,
      },
      decamelize: {
        type: 'boolean',
        default: true,
      },
      customReplacements: {
        type: 'tags',
        default: [],
        tooltip: `the format is "from:to,from2:to2". To remove a character, use "from:". To separate the word, use e.g. "@: at " (with spaces).`
      },
      preserveLeadingUnderscore: {
        type: 'boolean',
        default: false,
      },
      preserveTrailingDash: {
        type: 'boolean',
        default: false,
      },
    }
  },
  getFilename: {
    id: 'getFilename',
    fn: (v) => {
      return v.replace(/.+\//, '').replace(/\.[^\.]*$/, '')
    }
  }
}

export default transformers