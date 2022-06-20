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
    There are no content types. <a href="{basePath}/contentTypes/_">Add one!</a>
  {/each}
</ul>

{#if cms.contentTypes !== {}}
  <a href="{basePath}/contentTypes/_">+ new content type</a>
{/if}