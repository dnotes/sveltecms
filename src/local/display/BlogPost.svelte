<script lang="ts">
  export let item
</script>

<svelte:head>
  <title>{item.title} | SvelteCM Blog</title>
</svelte:head>

<h1>{item.title}</h1>
<p class="date">{item.date}</p>

{#if item?.image?.src}
  <img src={item.image.src} alt={item.image?.alt || ''} />
{/if}

{@html item.body}