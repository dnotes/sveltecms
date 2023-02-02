import type { CMSPluginBuilder, CMSPlugin } from 'sveltecms/core/Plugin'
// import CMSWidgetMarkdown from './CMSWidgetMarkdown.svelte'
import MarkdownIT from 'markdown-it'
import type { Options as MarkdownITOptions } from 'markdown-it'

let md:MarkdownIT

const pluginBuilder:CMSPluginBuilder = (config?:{
  md?:MarkdownIT,
  commonmark?:boolean,
  opts?:MarkdownITOptions
  // TODO: Make optionFields for markdown-it configuration, and disable/hide on admin screens when when config.md is provided
}) => {

  config = Object.assign({}, {
    commonmark: true,
    opts: {}
  }, config || {})

  if (config.md) md = config.md
  else {
    md = new MarkdownIT(config.commonmark ? 'commonmark' : 'default', config.opts)
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
        displays: {
          default: {
            type: 'div',
            html: true,
          },
          reference: 'none',
        },
        preMount: ['markdown'],
      },
    ],
    fieldWidgets: {
      markdown: ['textarea','value']
    },
    conf: {
      fieldgroups: {
        markdown: {
          id: 'markdown',
          tags: ['fullwidth','block','inline'],
          displays: 'div',
          fields: {
            text: 'markdown',
          }
        },
      }
    }
  }
  return plugin
}

export default pluginBuilder