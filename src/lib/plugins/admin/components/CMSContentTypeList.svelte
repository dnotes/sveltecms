<script lang="ts">
import type SvelteCMS from "sveltecms";

  export let cms:SvelteCMS
  export let basePath:string
  export let adminPath:string
  let configPath = adminPath.replace(/\/.+/, '')

</script>

<ul>
  {#each Object.values(cms.types) as contentType}
  <li>
    <a href="{basePath}/{configPath}/{contentType.id}">{contentType.label}</a>
  </li>
  {:else}
    There are no content types. <a href="{basePath}/types/_">Add one!</a>
  {/each}
</ul>

{#if cms.types !== {}}
  <a href="{basePath}/types/_">+ new content type</a>
{/if}