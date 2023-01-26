import { exec } from 'child_process';
import { promisify } from 'util';
import { readdirSync, unlinkSync } from 'fs';
import path from 'path';
import cp from 'recursive-copy';
import { fileURLToPath } from 'url'
import { create as createSvelte } from 'create-svelte'

let execPromise = promisify(exec)

/** @type {import('./types/index').create} */
export async function create(cwd, options) {
  Object.assign(options, { template:'skeleton', types:'typescript', name:path.basename(path.resolve(cwd)) })
  await createSvelte(cwd, options)
  await execPromise(`npm i -D sveltecms${options.version ? `@${options.version}` : ''}`, { cwd })
  let filedir = path.resolve(cwd, 'node_modules/sveltecms/.template')
  cp(filedir, cwd, { overwrite:true, dot:true })
  unlinkSync(path.resolve(cwd, `src/routes/+page.svelte`))
}
