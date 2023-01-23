import type { ProjectFiles } from '@stackblitz/sdk'
import type { PageServerLoad } from "./$types";

import cms from '$lib/cms'

async function getProjectFiles():Promise<ProjectFiles> {
  let allFiles = import.meta.glob('/newsite/**/*.*', { as:'raw' })
  let projectFiles = {}
  let promises = Object.keys(allFiles)
    .filter(k => !k.match(/\/(?:node_modules|.svelte-kit|static)\//))
    .forEach(async k => {
      projectFiles[k.replace(/^\/newsite\//, '')] = await allFiles[k]()
    })
  await promises
  return projectFiles
}

let content = cms.getContent('docs', 'getting-started')

export const load:PageServerLoad = async () => {
  let projectFiles = await getProjectFiles()
  return {
    content,
    projectFiles,
  }
}
