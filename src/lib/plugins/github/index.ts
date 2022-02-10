import type { SvelteCMSPlugin } from "sveltecms/global"

export const githubContent = {
  id: 'github-content',
  fn: (content, opts, fieldType) => {

  },
  optionFields: {

  }
}

export const githubMedia = {
  id: 'github-media',
  fn: (files, opts, fieldType) => {

  },
  optionFields: {

  }
}

const SvelteCMSPluginGithub:SvelteCMSPlugin = {
  contentStores: [
    githubContent
  ],
  mediaStores: [
    githubMedia
  ],
}

export default SvelteCMSPluginGithub
