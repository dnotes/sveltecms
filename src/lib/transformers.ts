import type { SvelteCMSFieldTransformer } from './global'
import sanitizeHtml from 'sanitize-html'

const transformers:{[id:string]:SvelteCMSFieldTransformer} = {
  toString: {
    id: 'toString',
    fn: (v) => v?.toString()
  },
  date: {
    id: 'date',
    fn: (v) => new Date(v)
  },
  html: {
    id: 'html',
    fn: (v) => { return sanitizeHtml(v) }
  },
  dateFormat: {
    id: 'dateFormat',
    fn: (v,opts) => {
      v = new Date(v)
      return v.toLocaleDateString(opts.locale, opts.dateFormatOptions)
    },
    optionFields: {
      locale: {
        type: 'text',
        default: '',
        description: "The locale to display the date, e.g. 'en-US', or empty to display in client's locale."
      },
      dateFormatOptions: {
        type: 'collection',
        default: {},
        fields: {
          timeZone: {
            type: 'text',
            default: '',
          },
        }
      }
    }
  },
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
  tags: {
    id: 'tags',
    fn: function parseTags(v,opts) {
      let regex = opts.allowSpaces ? new RegExp(`\s*${opts.delimiter}\s*`,'g') : new RegExp(`(?:\s|${opts.delimiter})+`, 'g')
      return v?.toString()?.split(regex) || v
    },
    optionFields: {
      delimiter: {
        type: 'text',
        default: ','
      },
      allowSpaces: {
        type: 'boolean',
        default: true,
      },
    },
  },
}

export default transformers