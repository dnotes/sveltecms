<script lang="ts">
import type SvelteCMS from "sveltecms";
import getLabelFromID from "sveltecms/utils/getLabelFromID";
import type { AdminPage } from 'sveltecms/plugins/admin'

  export let adminPath:string
  export let basePath:string
  export let data = []

  // console.log(data)

</script>

<ul>
  {#each data as item}
    <li>{item._slug} <a href="{basePath}/{adminPath}/{item._slug}">[edit]</a></li>
  {:else}
    No items found.
  {/each}
</ul>