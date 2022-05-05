<script lang="ts">
import type SvelteCMS from "sveltecms";

  export let cms:SvelteCMS
  export let basePath:string
  export let adminPath:string
  let contentPath = adminPath.replace(/\/.+/, '')

</script>

<ul>
  {#each Object.values(cms.types) as contentType}
  <li>
    <a href="{basePath}/{contentPath}/{contentType.id}">{contentType.label}</a>
  </li>
  {:else}
    There are no content types.
  {/each}
</ul>