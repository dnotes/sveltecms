import CMS from 'sveltecms'
// @ts-ignore TODO: why can't it find this?
import conf from './sveltecms.config.yml'
import markdownPlugin from 'sveltecms/plugins/markdown'
import defaultContent from 'sveltecms/plugins/defaultContent'

import MarkdownIT from 'markdown-it'
import MarkdownAttrs from 'markdown-it-attrs'
import MarkdownFootnotes from 'markdown-it-footnote'

import importContent from 'sveltecms/plugins/importContent'

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
  defaultContent,
  importContent,
])

export default cms