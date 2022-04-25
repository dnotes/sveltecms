<script lang="ts">
import type SvelteCMS from "sveltecms"
import { page } from '$app/stores'
import getLabelFromID from "./utils/getLabelFromID";

  export let cms:SvelteCMS
  export let adminPath:string = $page.params.adminPath

  let basePath = $page.url.pathname.replace('/' + adminPath, '')

  let sections = Object.entries(cms.adminPaths)
    .reduce((agg, [path, component]) => {
      if (!path.match('/') && !agg.includes(path)) agg.push(path)
      return agg
    }, [])

  $: component = cms.adminPaths[adminPath]

</script>

{#if component}
  <svelte:component this={component} {cms} {adminPath} />
{:else}
  <ul>
    {#each sections as section}
      <li>
        <a href="{basePath}/{section}">{getLabelFromID(section)}</a>
      </li>
    {/each}
  </ul>
{/if}

