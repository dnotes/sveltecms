<script lang="ts">
import type SvelteCMS from "sveltecms";

  export let cms:SvelteCMS
  export let adminPath:string
  export let basePath:string
  export let data = []

  let contentTypeID = adminPath.replace(/.+\//, '')

</script>

<h2>{cms.getContentType(contentTypeID).label}</h2>

<ul>
  {#each data as item}
    <li>{item._slug} <a href="{basePath}/{adminPath}/{item._slug}">[edit]</a></li>
  {:else}
    No items found.
  {/each}
</ul>