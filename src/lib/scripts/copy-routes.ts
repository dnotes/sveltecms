#!/usr/bin/env node
import cp from 'cp-file'
const path = process.env.INIT_CWD

const files = [
  ['../routes/[...path].svelte', `${path}/routes/[...path].svelte`],
  ['../routes/[...path].ts', `${path}/routes/[...path].ts`],
  ['../routes/admin/[...adminPath].svelte', `${path}/routes/admin/[...adminPath].svelte`],
  ['../routes/admin/[...adminPath].ts', `${path}/routes/admin/[...adminPath].ts`],
  ['../routes/admin/__layout.svelte', `${path}/routes/admin/__layout.svelte`],
]
files.forEach(([file,dest]) => {
  try {
    cp.sync(file, dest)
    console.log(`copied ${file} -> ${dest}`)
  }
  catch(e) {
    e.message = `Error copying SvelteCMS file "${file}" -> "${dest}":\n${e.message}`
    throw e
  }
})
