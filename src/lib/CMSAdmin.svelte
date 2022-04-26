<script lang="ts">
import type SvelteCMS from "sveltecms"
import { page } from '$app/stores'
import getLabelFromID from "./utils/getLabelFromID";

  export let cms:SvelteCMS

  let basePath = $page.url.pathname.replace('/' + $page.params.adminPath, '')

  let sections = Object.entries(cms.adminPaths)
    .reduce((agg, [path, component]) => {
      if (!path.match('/') && !agg.includes(path)) agg.push(path)
      return agg
    }, [])

  $: component = cms.getAdminPath($page.params.adminPath)

</script>

{#if component}
  <svelte:component this={component} {cms} adminPath={$page.params.adminPath} />
{:else}
  <ul>
    {#each sections as section}
      <li>
        <a href="{basePath}/{section}">{getLabelFromID(section)}</a>
      </li>
    {/each}
  </ul>
{/if}

