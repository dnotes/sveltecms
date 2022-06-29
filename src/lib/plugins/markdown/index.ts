import type { CMSPluginBuilder, CMSPlugin } from '../..'
// import CMSWidgetMarkdown from './CMSWidgetMarkdown.svelte'
import MarkdownIT from 'markdown-it'
import type { Options as MarkdownITOptions } from 'markdown-it'

let md:MarkdownIT

const pluginBuilder:CMSPluginBuilder = (config:{
  md?:MarkdownIT,
  commonmark?:boolean,
  opts?:MarkdownITOptions
}) => {

  config = Object.assign({}, {
    commonmark: true,
  }, config)

  if (config.md) md = config.md
  else {
    md = new MarkdownIT(config.commonmark ? 'commonmark' : 'default')
  }

  const plugin:CMSPlugin = {
    id: 'markdown',
    transformers: [
      {
        id: 'markdown',
        description: `Converts Markdown text to HTML using a Markdown processor (by default markdown-it).`,
        fn: (value) => {
          return md.render(value)
        },
      }
    ],
    fieldTypes: [
      {
        id: 'markdown',
        default: '',
        widget: 'textarea',
        display: {
          type: 'div',
          html: true,
        },
        preMount: ['markdown'],
      },
    ],
    fieldWidgets: {
      markdown: ['textarea']
    },
  }
  return plugin
}

export default pluginBuilder