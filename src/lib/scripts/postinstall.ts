#!/usr/bin/env node
import cp from 'cp-file'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fromPath = path.resolve(__dirname, '../install')
const toPath = path.resolve(process.env.INIT_CWD, 'src')

const files = [
  [`${fromPath}/routes/[...path].svelte`,             `${toPath}/routes/[...path].svelte`],
  [`${fromPath}/routes/[...path].ts`,                 `${toPath}/routes/[...path].ts`],
  [`${fromPath}/routes/admin/[...adminPath].svelte`,  `${toPath}/routes/admin/[...adminPath].svelte`],
  [`${fromPath}/routes/admin/[...adminPath].ts`,      `${toPath}/routes/admin/[...adminPath].ts`],
  [`${fromPath}/routes/admin/__layout.svelte`,        `${toPath}/routes/admin/__layout.svelte`],
  [`${fromPath}/cms.ts`,                              `${toPath}/lib/cms.ts`],
  [`${fromPath}/sveltecms.config.json`,               `${toPath}/lib/sveltecms.config.json`],
  [`${fromPath}/sveltecms.config.yml`,                `${toPath}/lib/sveltecms.config.yml`],
]
files.forEach(([file,dest]) => {
  try {
    cp.sync(file, dest, { overwrite:false })
    console.log(`copied ${file} -> ${dest}`)
  }
  catch(e) {
    e.message = `Error copying SvelteCMS file "${file}" -> "${dest}":\n${e.message}`
    throw e
  }
})
