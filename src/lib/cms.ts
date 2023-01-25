import CMS from 'sveltecms'
// @ts-ignore TODO: why can't it find this?
import conf from './sveltecms.config.yml'
import markdownPluginBuilder from 'sveltecms/plugins/markdown'
import defaultContent from 'sveltecms/plugins/defaultContent'

import md from '$lib/md'
const markdownPlugin = markdownPluginBuilder({ md })

const cms = new CMS(conf, [
  markdownPlugin,
  defaultContent,
])

export default cms