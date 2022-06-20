<script>export let value;
</script>

{#if (typeof value === 'string' && value) || value?.['src']}
  <img src={value?.['src'] ?? value} alt={value?.['alt'] ?? ''} title={value?.['title'] ?? ''} />
{/if}