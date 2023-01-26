import cp from 'recursive-copy';
import { fileURLToPath } from 'url'

/** @type {import('./types/index').createSvelteCMS} */
export async function create(cwd, options) {
  let filedir = fileURLToPath(new URL('./template', import.meta.url))
  Object.assign(options, { template:'skeleton', types:'typescript', name:path.basename(path.resolve(cwd)) })
  await create(cwd, options)
  await cp(filedir, cwd, { overwrite:true, dot:true })
}
