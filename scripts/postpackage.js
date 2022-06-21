#!/usr/bin/env node
import cp from 'cp-file'
import fs from 'fs'

let packageJSON = JSON.parse(
  await fs.readFileSync(
    new URL('../package/package.json', import.meta.url)
  )
)

const files = [
  ['src/routes/[...path].svelte', 'package/routes/[...path].svelte'],
  ['src/routes/[...path].ts', 'package/routes/[...path].ts'],
  ['src/routes/admin/[...adminPath].svelte', 'package/routes/admin/[...adminPath].svelte'],
  ['src/routes/admin/[...adminPath].ts', 'package/routes/admin/[...adminPath].ts'],
  ['src/routes/admin/__layout.svelte', 'package/routes/admin/__layout.svelte'],
]
files.forEach(([file,dest]) => {
  try {
    cp.sync(file, dest)
    console.log(`copied ${file} -> ${dest}`)
  }
  catch(e) {
    e.message = `Error copying "${file}" to "${dest}":\n${e.message}`
    throw e
  }
})

packageJSON.scripts = {
  postinstall: "./scripts/copy-routes.js"
}

fs.writeFileSync('package/package.json', JSON.stringify(packageJSON, null, 2))
