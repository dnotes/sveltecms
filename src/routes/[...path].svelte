<script lang="ts">
  import cms from '$lib/cms' // TODO: pare this down; we shouldn't need the full CMS
  export let contentTypeID
  export let content
  let contentType = cms.getContentType(contentTypeID)
  let displayComponent = cms.getDisplayComponent(contentType.displayComponent?.['type'] || contentType.displayComponent, 'content')
</script>

{#await content}
  fetching content...
{:then content}
  {#if Array.isArray(content)}
    <ul>
      {#each content as item}
        <li><a rel="prefetch" href="/{contentTypeID}/{item._slug}">{item._slug}</a></li>
      {/each}
    </ul>
  {:else if displayComponent?.component}
    <svelte:component this={displayComponent.component} {cms} {content} {contentTypeID} />
  {:else if cms.components['content']}
    <svelte:component this={cms.components['content']?.component} {cms} {content} {contentTypeID} />
  {:else}
    {JSON.stringify(content)}
  {/if}
{:catch error}
  {JSON.stringify(error)}
{/await}