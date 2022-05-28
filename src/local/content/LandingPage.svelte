<script lang="ts">
import type { Content } from 'sveltecms/core/ContentStore';

import hero from '$lib/block/Hero.svelte'
import frontslides from '$lib/block/FrontSlides.svelte'

  export let content:Content

  const components = {
    hero,
    frontslides
  }

</script>

<svelte:head>
  <title>SvelteCMS | {content.title || ''}</title>
</svelte:head>

{#if content.blocks && Array.isArray(content.blocks)}
  {#each content.blocks as item}
    {#if components[item?.['_collectionType']]}
      <svelte:component this={components[item['_collectionType']]} {...item} />
    {/if}
  {/each}
{/if}
