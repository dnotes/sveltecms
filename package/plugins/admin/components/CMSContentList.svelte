<script>import Button from "sveltecms/ui/Button.svelte";
export let adminPath;
export let basePath;
export let data = [];
let contentTypeID = adminPath.replace(/.+\//, '');
</script>

<Button primary href="{basePath}/{adminPath}/_">+ add</Button>

<ul>
  {#each data as item}
    <li>{item._slug} <a href="{basePath}/{adminPath}/{item._slug}">[edit]</a></li>
  {:else}
    No items found.
  {/each}
</ul>