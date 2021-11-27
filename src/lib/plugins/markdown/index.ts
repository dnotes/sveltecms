import type { SvelteCMSPluginBuilder, SvelteCMSPlugin } from '../../global'
// import CMSWidgetMarkdown from './CMSWidgetMarkdown.svelte'
import MarkdownIT from 'markdown-it'
import type { Options as MarkdownITOptions } from 'markdown-it'

let md:MarkdownIT

const pluginBuilder:SvelteCMSPluginBuilder = (config:{
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

  const plugin:SvelteCMSPlugin = {
    transformers: [
      {
        id: 'markdown',
        fn: (value) => {
          return md.render(value)
        },
      }
    ],
    fieldTypes: [
      {
        id: 'markdown',
        defaultValue: '',
        defaultWidget: 'textarea',
        defaultPreMount: ['markdown']
      },
    ],
  }
  return plugin
}

export default pluginBuilder