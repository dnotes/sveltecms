<script lang="ts">
import sdk from '@stackblitz/sdk'

const readme=`
# Welcome to SvelteCMS!

To install SvelteCMS, please run the following commands in the terminal below:

    npm create sveltecms@latest
    npm run dev

StackBlitz integration is experimental--the Admin UI takes a while to load, and you may encounter errors! :)
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

  <p>Installing SvelteCMS is easy if you use NPM:</p>

  <pre><code>
    > npm create sveltecms@latest
    > npm run dev
  </code></pre>

  <p>
    After it is installed, you should be able to begin creating content through the Admin UI.
    You can also build out Fields and Content Types much as you might with any other Content Management System.
  </p>

  <p>
    We are working on using the WebContainer API to provide a first-class site building experience
    that runs entirely in your browser. As a test, you can try running SvelteCMS in StackBlitz:
  </p>

  <div class="flex flex-col text-center">
    <button type="button" class="inline-block text-xl border-2 px-5 py-2 rounded-full border-cyan-600 text-cyan-600" on:click={newProject}>Try it on StackBlitz</button>
    <noscript class="mx-auto block">(requires javascript)</noscript>
  </div>

</div>
