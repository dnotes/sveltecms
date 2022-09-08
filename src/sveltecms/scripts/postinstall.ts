#!/usr/bin/env node
import cp from 'cp-file'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fromPath = path.resolve(__dirname, '../install')
const toPath = path.resolve(process.env.INIT_CWD)

const files = [
  // The '/[...path]' routes
  [`${fromPath}/routes/(cms)/[...path]/+page.svelte`, `${toPath}/src/routes/(cms)/[...path]/+page.svelte`],
  [`${fromPath}/routes/(cms)/[...path]/+page.ts`,     `${toPath}/src/routes/(cms)/[...path]/+page.ts`],

  // The '/admin' routes
  [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.svelte`,    `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.svelte`],
  [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.ts`,        `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.ts`],
  [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.server.ts`, `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.server.ts`],
  [`${fromPath}/routes/(cms)/admin/+layout.svelte`,                 `${toPath}/src/routes/(cms)/admin/+layout.svelte`],

  // Files for the $lib folder
  [`${fromPath}/cms.ts`,                `${toPath}/src/lib/cms.ts`],
  [`${fromPath}/sveltecms.config.json`, `${toPath}/src/lib/sveltecms.config.json`],
  [`${fromPath}/sveltecms.config.yml`,  `${toPath}/src/lib/sveltecms.config.yml`],

  // Files for dependencies (SvelteKit, Vite, Tailwind)
  [`${fromPath}/tailwind.config.cjs`, `${toPath}/tailwind.config.cjs`],

]
files.forEach(([file,dest]) => {
  try {
    cp.sync(file, dest, { overwrite:false })
    console.log(`copied ${file} -> ${dest}`)
  }
  catch(e) {
    console.error(`Error copying SvelteCMS file "${file}" -> "${dest}":\n${e.message}`)
  }
})
