<script lang="ts">
  import { onMount } from "svelte";
  import sdk from '@stackblitz/sdk'

  const readme=`
  # Welcome to SvelteCMS!

  To install SvelteCMS, please run the following commands in the terminal below:

    * \`npm create sveltecms@latest\`
    * \`npm run dev\`

  ## StackBlitz integration is experimental!

  The Admin UI takes a long time to load, and half of the time there is a huge error that never gets resolved. It seems to help if you wait for a minute or two after \`npm run dev\` before clicking on the Admin link. (This doesn't happen in local development.)
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

    let el:HTMLElement

    onMount(() => {
      el.querySelectorAll('.stackblitz').forEach(item => {
        item.addEventListener('click', newProject)
      })
      return () => {
        el.querySelectorAll('.stackblitz').forEach(item => {
          item.removeEventListener('click', newProject)
        })
      }
    })

  </script>

  <div bind:this={el}>
    <slot />
  </div>