import CMS from 'sveltecms'
import conf from './sveltecms.config.json'
import markdownPlugin from 'sveltecms/plugins/markdown'

const cms = new CMS(conf, [
  markdownPlugin({})
])

export default cms
