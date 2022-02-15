import type { CMSPlugin } from "$lib/global"

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

const CMSPluginGithub:CMSPlugin = {
  contentStores: [
    githubContent
  ],
  mediaStores: [
    githubMedia
  ],
}

export default CMSPluginGithub
