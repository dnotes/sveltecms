import type { SvelteCMSFieldTransformer } from '../global'

const transformers:{[id:string]:SvelteCMSFieldTransformer} = {
  toString: {
    id: 'toString',
    fn: (v) => v.toString()
  },
  date: {
    id: 'date',
    fn: (v) => new Date(v)
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
      return v.toString().split(regex)
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