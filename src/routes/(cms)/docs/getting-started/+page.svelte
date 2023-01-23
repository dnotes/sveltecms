<script lang="ts">
  import sdk from '@stackblitz/sdk'
  import type { Project, OpenOptions } from '@stackblitz/sdk'
  import type PageData from './$types'
  import Button from 'sveltecms/ui/Button.svelte';

  export let data:PageData
  let projectFiles = data.projectFiles
  let version = JSON.parse(projectFiles['package.json'])?.dependencies?.sveltecms

  let projectOptions:OpenOptions = {
    newWindow: false,
    view: 'preview',
    openFile: 'README.md',
  }
  let projectConfig:Project = {
    title: 'SvelteCMS Starter',
    description: 'A new site running SvelteCMS ' + version,
    template: 'node',
    files: data.projectFiles,
  }

  function stackblitz() {
    sdk.openProject(projectConfig, projectOptions)
  }
</script>

<div class="prose dark:prose-invert prose-xl mx-auto w-full">
  <Button highlight on:click={stackblitz}>New Project on StackBlitz</Button>

  <pre>
    <code>
      {JSON.stringify(projectConfig, null, 2)}
    </code>
  </pre>
</div>
