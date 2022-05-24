<script>export let cms;
export let basePath;
export let adminPath;
let configPath = adminPath.replace(/\/.+/, '');
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