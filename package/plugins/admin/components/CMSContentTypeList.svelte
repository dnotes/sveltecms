<script>export let cms;
export let basePath;
export let adminPath;
let configPath = adminPath.replace(/\/.+/, '');
</script>

<ul>
  {#each Object.values(cms.contentTypes) as contentType}
  <li>
    <a href="{basePath}/{configPath}/{contentType.id}">{contentType.label}</a>
  </li>
  {:else}
    There are no content types. <a href="{basePath}/contentTypes">Add one!</a>
  {/each}
</ul>

{#if Object.keys(cms.contentTypes || {}).length}
  <a href="{basePath}/contentTypes">+ new content type</a>
{/if}