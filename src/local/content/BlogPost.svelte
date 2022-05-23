<script lang="ts">
  // @ts-ignore WHY!
  import { browser } from '$app/env'
  export let item

  let lang = 'en-US'
  $: if (browser && window?.navigator?.language) lang = window.navigator.language
  $: displayDate = item.date.toLocaleString(lang, { timeZone: 'America/Los_Angeles', timeZoneName: 'short' }).replace(/:\d{2} /, ' ')

</script>

<svelte:head>
  <title>{item.title} | SvelteCM Blog</title>
</svelte:head>

<h1>{item.title}</h1>
<p class="date">{displayDate}</p>

{#if item?.image?.src}
  <img src={item.image.src} alt={item.image?.alt || ''} />
{/if}

{@html item.body}

<style>
  img { width: 600px; max-width: 100%; }
</style>
