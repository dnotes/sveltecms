import CMS from 'sveltecms'
import conf from './cms-config.json'
import staticFilesPlugin from 'sveltecms/plugins/staticFiles'
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
  staticFilesPlugin,
  markdownPlugin({ md })
])

export default cms