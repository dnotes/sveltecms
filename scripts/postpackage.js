#!/usr/bin/env node
import cp from 'cp-file'
import fs from 'fs'

let packageJSON = JSON.parse(
  await fs.readFileSync(
    new URL('../package/package.json', import.meta.url)
  )
)

const files = [
  ['src/routes/[...path].svelte',             'package/install/routes/[...path].svelte'],
  ['src/routes/[...path].ts',                 'package/install/routes/[...path].ts'],
  ['src/routes/admin/[...adminPath].svelte',  'package/install/routes/admin/[...adminPath].svelte'],
  ['src/routes/admin/[...adminPath].ts',      'package/install/routes/admin/[...adminPath].ts'],
  ['src/routes/admin/__layout.svelte',        'package/install/routes/admin/__layout.svelte'],
  ['src/install/cms.ts',                      'package/install/cms.ts'],
  ['src/install/sveltecms.config.json',       'package/install/sveltecms.config.json'],
  ['src/install/sveltecms.config.yml',        'package/install/sveltecms.config.yml'],
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
  postinstall: "./scripts/postinstall.js"
}

fs.writeFileSync('package/package.json', JSON.stringify(packageJSON, null, 2))
fs.chmodSync('package/scripts/postinstall.js', 0o755)
