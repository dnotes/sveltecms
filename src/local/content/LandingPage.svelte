<script lang="ts">
import type { Content } from 'sveltecms/core/ContentStore';

import hero from '$lib/block/Hero.svelte'
import frontslides from '$lib/block/FrontSlides.svelte'

  export let item:Content

  const components = {
    hero,
    frontslides
  }

</script>

<svelte:head>
  <title>SvelteCMS | {item.title || ''}</title>
</svelte:head>

{#if item.blocks && Array.isArray(item.blocks)}
  {#each item.blocks as block}
    {#if components[block?.['_fieldgroup']]}
      <svelte:component this={components[block['_fieldgroup']]} item={block} />
    {/if}
  {/each}
{/if}
