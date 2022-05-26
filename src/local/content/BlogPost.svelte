<script lang="ts">
  // @ts-ignore WHY!
  import { browser } from '$app/env'
  export let content

  let lang = 'en-US'
  $: if (browser && window?.navigator?.language) lang = window.navigator.language
  $: displayDate = content?.date?.toLocaleString(lang, { timeZone: 'America/Los_Angeles', timeZoneName: 'short' }).replace(/:\d{2} /, ' ') || 'no date'

</script>

<svelte:head>
  <title>{content.title || 'No Title'} | SvelteCMS Blog</title>
</svelte:head>

<h1>{content.title || 'No Title'}</h1>
<p class="date">{displayDate}</p>

{#if content?.image?.src}
  <img src={content.image.src} alt={content.image?.alt || ''} />
{/if}

{@html content?.body || ''}

<style>
  img { width: 600px; max-width: 100%; }
</style>
