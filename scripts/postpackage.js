#!/usr/bin/env node
import cp from 'cp-file'
import fs from 'fs'

let packageJSON = JSON.parse(
  await fs.readFileSync(
    new URL('../package/package.json', import.meta.url)
  )
)

const files = [
  // The default front page route
  ['src/install/+page.svelte', `package/install/routes/+page.svelte`],

  // The '/[...path]' routes
  ['src/routes/(cms)/[...path]/+layout.ts',     'package/install/routes/(cms)/[...path]/+layout.ts'],
  ['src/routes/(cms)/[...path]/+layout.svelte', 'package/install/routes/(cms)/[...path]/+layout.svelte'],
  ['src/routes/(cms)/[...path]/+page.ts',       'package/install/routes/(cms)/[...path]/+page.ts'],
  ['src/routes/(cms)/[...path]/+page.svelte',   'package/install/routes/(cms)/[...path]/+page.svelte'],

  // The '/admin' routes
  ['src/routes/(cms)/admin/+layout.svelte',                 'package/install/routes/(cms)/admin/+layout.svelte'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.server.ts', 'package/install/routes/(cms)/admin/[...adminPath]/+page.server.ts'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.ts',        'package/install/routes/(cms)/admin/[...adminPath]/+page.ts'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.svelte',    'package/install/routes/(cms)/admin/[...adminPath]/+page.svelte'],

  // Files for the $lib folder
  ['src/install/cms.ts',                'package/install/cms.ts'],
  ['src/install/sveltecms.config.json', 'package/install/sveltecms.config.json'],
  ['src/install/sveltecms.config.yml',  'package/install/sveltecms.config.yml'],

  // Files for dependencies (SvelteKit, Vite, Tailwind)
  ['tailwind.config.cjs', 'package/install/tailwind.config.cjs'],

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
