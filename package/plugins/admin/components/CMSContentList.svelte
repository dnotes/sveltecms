<script>import { isArray } from "lodash-es";
import Button from "../../../ui/Button.svelte";
export let adminPath;
export let basePath;
export let data = [];
</script>

<Button primary href="{basePath}/{adminPath}/_">+ add</Button>

<ul>
  {#if Array.isArray(data)}
    {#each (data || []) as item}
      <li>{item._slug} <a href="{basePath}/{adminPath}/{item._slug}">[edit]</a></li>
    {:else}
      No items found.
    {/each}
  {/if}
</ul>