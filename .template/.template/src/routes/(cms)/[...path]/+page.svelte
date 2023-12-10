<script lang="ts">
import type { PageData } from './$types'
import cms from '$lib/cms' // TODO: pare this down; we shouldn't need the full CMS
import type { Content } from 'sveltecms/core/ContentStore';
import Wrapper from 'sveltecms/display/Wrapper.svelte';
import ContentItem from 'sveltecms/display/ContentItem.svelte'
import { Display, isDisplayConfig, type DisplayConfigSetting } from 'sveltecms/core/Display';

  export let data:PageData
  let contentTypeID:string
  let content:Content
  $: ({contentTypeID, content} = data)

  // Get the content type
  $: contentTypeID = contentTypeID || cms?.conf?.settings?.rootContentType?.toString()
  $: contentType = cms.contentTypes[contentTypeID] || { ...cms.defaultContentType, id:contentTypeID }
  $: items = Array.isArray(content) ? content : [content]

  // Get the proper display
  let display:Display, displayConfigSetting:string|DisplayConfigSetting
  $: displayMode = Array.isArray(content) ? 'teaser' : 'page'
  $: displayConfigSetting = (typeof contentType.displays === 'string' || isDisplayConfig(contentType.displays)) ? contentType.displays : (contentType?.displays?.[displayMode] ?? contentType?.displays?.default ?? 'div')
  $: display = new Display(displayConfigSetting, cms)

</script>

{#if display.isDisplayed}
  {#if display?.wrapper?.isDisplayed}

    <Wrapper
      {cms}
      entity={contentType}
      {displayMode}
      display={display.wrapper}
    >
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
