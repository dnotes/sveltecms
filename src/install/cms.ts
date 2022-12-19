import CMS from 'sveltecms'
import conf from './sveltecms.config.json'
import markdownPlugin from 'sveltecms/plugins/markdown'
import defaultContent from 'sveltecms/plugins/defaultContent'

const cms = new CMS(conf, [
  markdownPlugin(),
  defaultContent
])

export default cms
