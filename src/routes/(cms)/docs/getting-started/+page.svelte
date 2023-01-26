<script lang="ts">
import sdk from '@stackblitz/sdk'
import md from '$lib/md'
import type { PageData } from '../../[...path]/$types';

export let data:PageData


const readme=`
# Welcome to SvelteCMS!

To install SvelteCMS, please run the following commands in the terminal below:

  * \`npm create sveltecms@latest\`
  * \`npm run dev\`

## StackBlitz integration is experimental!

The Admin UI takes a long time to load, and half of the time there is a huge error that never gets resolved. It seems to help if you wait for a bit after \`npm run dev\` before clicking on the Admin link. (This doesn't happen in local development.)
`

  function newProject() {
    sdk.openProject({
      title: 'SvelteCMS Test',
      description: 'Try out SvelteCMS in a WebContainer on StackBlitz.com',
      template: 'node',
      files: { '_README.md':readme }
    }, {
      openFile: '_README.md',
    })
  }
</script>

<div class="prose prose-stone dark:prose-invert prose-lg mx-auto">

  <h1>Getting Started</h1>

  {@html data?.content?.body}

  <div class="flex flex-col text-center">
    <button type="button" class="inline-block text-xl border-2 px-5 py-2 rounded-full border-cyan-600 text-cyan-600" on:click={newProject}>Try it on StackBlitz</button>
    <noscript class="mx-auto block">(requires javascript)</noscript>
  </div>
</div>
