<script lang="ts">
import cms from '$lib/cms' // TODO: pare this down; we shouldn't need the full CMS
import type { Content } from 'sveltecms/core/ContentStore';
import Wrapper from 'sveltecms/display/Wrapper.svelte';
import ContentItem from 'sveltecms/display/ContentItem.svelte'
import { Display } from 'sveltecms/core/Display';

  export let contentTypeID:string
  export let content:Content

  // Get the content type
  $: contentType = cms.getContentType(contentTypeID || cms?.conf?.settings?.rootContentType?.toString())
  $: items = Array.isArray(content) ? content : [content]

  // Get the proper display
  let display:Display
  $: displayMode = Array.isArray(content) ? 'teaser' : 'page'
  $: display = new Display(contentType?.displayModes?.[displayMode] ?? contentType?.display ?? 'div', cms)

</script>

{#if display.isDisplayed}
  {#if display?.wrapper?.isDisplayed}

    <Wrapper display={display.wrapper}>
      {#each items as item}
        <ContentItem
          {cms}
          entity={contentType}
          {item}
          {displayMode}
        />
      {/each}
    </Wrapper>

  {:else}

    {#each items as item}
      <ContentItem
        {cms}
        entity={contentType}
        {item}
        {displayMode}
      />
    {/each}

  {/if}
{/if}
