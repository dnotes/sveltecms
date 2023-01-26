#!/usr/bin/env node
import cp from 'cp-file'
import sade from 'sade'
import rm from 'rimraf'
import { create } from 'create-svelte'
import { unlinkSync, existsSync } from 'fs'

const files = [
  // The default front page route
  ['src/install/+layout.svelte', `newsite/src/routes/+layout.svelte`],

  // The main CMS layout, where content is loaded
  ['src/routes/(cms)/+layout.ts',     'newsite/src/routes/(cms)/+layout.ts'],
  ['src/routes/(cms)/+layout.svelte', 'newsite/src/routes/(cms)/+layout.svelte'],

  // The '/[...path]' routes
  ['src/routes/(cms)/[...path]/+layout.ts',     'newsite/src/routes/(cms)/[...path]/+layout.ts'],
  ['src/routes/(cms)/[...path]/+page.svelte',   'newsite/src/routes/(cms)/[...path]/+page.svelte'],

  // The '/admin' routes
  ['src/routes/(cms)/admin/+layout@.svelte',                'newsite/src/routes/(cms)/admin/+layout@.svelte'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.server.ts', 'newsite/src/routes/(cms)/admin/[...adminPath]/+page.server.ts'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.ts',        'newsite/src/routes/(cms)/admin/[...adminPath]/+page.ts'],
  ['src/routes/(cms)/admin/[...adminPath]/+page.svelte',    'newsite/src/routes/(cms)/admin/[...adminPath]/+page.svelte'],
  ['src/routes/(cms)/admin/[...adminPath]/+server.ts',      'newsite/src/routes/(cms)/admin/[...adminPath]/+server.ts'],

  // Files for the $lib folder
  ['src/install/cms.ts',                'newsite/src/lib/cms.ts'],
  ['src/install/sveltecms.config.json', 'newsite/src/lib/sveltecms.config.json'],
  ['src/install/sveltecms.config.yml',  'newsite/src/lib/sveltecms.config.yml'],

  // Files for dependencies (SvelteKit, Vite, Tailwind)
  ['src/install/tailwind.config.cjs', 'newsite/tailwind.config.cjs'],
  ['src/install/app.css', 'newsite/src/app.css'],

  // README file
  ['src/install/README.md', 'newsite/README.md']

]

sade('postpackage', true)
  .describe('Create files for a new SvelteCMS project')
  .action(async() => {
    rm.sync('newsite')
    await create('newsite', { template:'skeleton', types:'typescript', name:'sveltecms' })
    files.forEach(([file,dest]) => {
      try {
        cp.sync(file, dest)
        console.log(`copied ${file} -> ${dest}`)
      }
      catch(e) {
        e.message = `Error copying "${file}" to "${dest}":\n${e.message}`
        throw e
      }
    });
    if (existsSync('newsite/src/routes/+page.svelte')) unlinkSync('newsite/src/routes/+page.svelte')
  })
  .parse(process.argv)