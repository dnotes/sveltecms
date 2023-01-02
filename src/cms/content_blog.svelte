<script lang="ts">
import type { Content } from 'sveltecms/core/ContentStore';
import type { Media } from 'sveltecms/core/MediaStore';
import { browser } from '$app/environment'
  export let item:Content & {
    date?: Date,
    image?: Media
  }

  let lang = 'en-US'
  $: if (browser && window?.navigator?.language) lang = window.navigator.language
  $: displayDate = item?.date?.toLocaleString(lang, { timeZone: 'America/Los_Angeles', timeZoneName: 'short' }).replace(/:\d{2} /, ' ') || 'no date'

</script>

<svelte:head>
  <title>{item.title || 'No Title'} | SvelteCMS Blog</title>
</svelte:head>

<h1>{item.title || 'No Title'}</h1>
<p class="date">{displayDate}</p>

{#if item?.image?.['src']}
  <img src={item.image['src']} alt={item.image?.['alt']?.toString() || ''} />
{/if}

{@html item.body || ''}

