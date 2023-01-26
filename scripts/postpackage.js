#!/usr/bin/env node
import cp from 'cp-file'
import sade from 'sade'
import rm from 'rimraf'
import { fileURLToPath } from 'url'

import mainPkg from '../package.json' assert { type:'json' }
const { version } = mainPkg

import files from '../src/sveltecms/manifest.js'

const toDir = fileURLToPath(new URL('../package/.template', import.meta.url).href)
const fromDir = fileURLToPath(new URL(`..`, import.meta.url).href)

sade('postpackage', true)
  .describe('Create files for a new SvelteCMS project')
  .action(async() => {
    rm.sync(toDir)
    files.forEach(file => {
      let dest = `${toDir}/${file.path}`
      let src = `${fromDir}${file.src ?? file.path}`
      try {
        cp.sync(src, dest)
        console.log(`copied ${src} -> ${dest}`)
      }
      catch(e) {
        e.message = `Error copying "${src}" to "${dest}":\n${e.message}`
        throw e
      }
    });
  })
  .parse(process.argv)