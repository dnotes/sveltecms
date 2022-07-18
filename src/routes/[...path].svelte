<script lang="ts">
import cms from '$lib/cms' // TODO: pare this down; we shouldn't need the full CMS
import type { Content } from 'sveltecms/core/ContentStore';
import Wrapper from 'sveltecms/display/Wrapper.svelte';
import ContentItem from 'sveltecms/display/ContentItem.svelte'

  export let contentTypeID:string
  export let content:Content

  // Get the content type
  let contentType = cms.getContentType(contentTypeID || cms?.conf?.settings?.rootContentType?.toString())

</script>

{#if contentType.display.wrapper}

<Wrapper display={contentType.display.wrapper}>
  {#await content then content}
    {#if Array.isArray(content)}
      {#each content as item}
        <div><a rel="prefetch" href="/{contentTypeID}/{item._slug}">
          {#if contentType.display?.component}
            <svelte:component
              this={contentType.display.component.component}
              {cms}
              item={content}
              entity={contentType}
            />
          {:else}
            <ContentItem
              {cms}
              item={content}
              entity={contentType}
            />
          {/if}
        </a></div>
      {/each}
    {:else if contentType.display?.component}
      <svelte:component
        this={contentType.display.component.component}
        {cms}
        item={content}
        entity={contentType}
      />
    {:else}
      <ContentItem
        {cms}
        item={content}
        entity={contentType}
      />
    {/if}
  {:catch error}
    {JSON.stringify(error)}
  {/await}
</Wrapper>

{:else}

{#await content then content}
  {#if Array.isArray(content)}
    {#each content as item}
      <div><a rel="prefetch" href="/{contentTypeID}/{item._slug}">
        {#if contentType.display?.component}
          <svelte:component
            this={contentType.display.component.component}
            {cms}
            item={content}
            entity={contentType}
          />
        {:else}
          <ContentItem
            {cms}
            item={content}
            entity={contentType}
          />
        {/if}
      </a></div>
    {/each}
  {:else if contentType.display?.component}
    <svelte:component
      this={contentType.display.component.component}
      {cms}
      item={content}
      entity={contentType}
    />
  {:else}
    <ContentItem
      {cms}
      item={content}
      entity={contentType}
    />
  {/if}
{:catch error}
  {JSON.stringify(error)}
{/await}

{/if}