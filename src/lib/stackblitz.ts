import type { ProjectFiles, OpenOptions, Project } from '@stackblitz/sdk'

const allProjectFiles = import.meta.glob('/newsite/**/*.*', { as:'raw', eager:true })

export const projectFiles:ProjectFiles = Object.fromEntries(
  Object.keys(allProjectFiles)
  .filter(k => !k.match(/\/(?:node_modules|.svelte-kit|static)\//))
  .map(k => ([k.replace(/^\/newsite\//, ''), allProjectFiles[k]]))
)

export const openOptions:OpenOptions = {
  view: 'preview',
  openFile: 'README.md',
}

export const newProject:Project = {
  title: 'SvelteCMS Starter',
  description: 'A new site running SvelteCMS ',
  template: 'node',
  files: projectFiles,
}
