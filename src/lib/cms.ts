import CMS from 'sveltecms'
// @ts-ignore TODO: why can't it find this?
import conf from './sveltecms.config.yml'
import components from './sveltecms.config.yml.components'
import markdownPlugin from 'sveltecms/plugins/markdown'

import MarkdownIT from 'markdown-it'
import MarkdownAttrs from 'markdown-it-attrs'
import MarkdownFootnotes from 'markdown-it-footnote'

const md = new MarkdownIT({
  html:false,
  linkify:true,
  typographer:true,
})
.use(MarkdownAttrs, {
  allowedAttributes: ['id','class']
})
.use(MarkdownFootnotes)

const cms = new CMS(conf, [
  markdownPlugin({ md }),
  {
    id: 'customComponents',
    components
  }
])

export default cms