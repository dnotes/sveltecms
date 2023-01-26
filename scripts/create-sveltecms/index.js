import { exec } from 'child_process';
import { promisify } from 'util';
import { unlinkSync } from 'fs';
import path from 'path';
import cp from 'recursive-copy';
import { fileURLToPath } from 'url'

let execPromise = promisify(exec)

/** @type {import('./types/index').createSvelteCMS} */
export async function create(cwd, options) {
  Object.assign(options, { template:'skeleton', types:'typescript', name:path.basename(path.resolve(cwd)) })
  await create(cwd, options)
  await execPromise(`npm i -D sveltecms${options.version ? `@${options.version}` : ''}`, { cwd })
  let filedir = fileURLToPath(new URL('./node_modules/sveltecms/.template', cwd).href)
  cp(filedir, cwd, { overwrite:true, dot:true })
  unlinkSync(path.resolve(cwd, `/src/routes/+page.svelte`))
}
