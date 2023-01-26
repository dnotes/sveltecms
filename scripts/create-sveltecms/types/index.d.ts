import type { Options } from 'create-svelte/types/internal'

export type CreateSvelteCMSOptions = Omit<Options, 'template'|'types'|'name'> & {
  version: string
}

export function createSvelteCMS(cwd:string, options:CreateSvelteCMSOptions): Promise<void>
