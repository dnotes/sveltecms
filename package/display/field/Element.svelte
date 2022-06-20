<script>export let field;
export let value;
</script>

<svelte:element
  this={field?.['display']?.['type'] || field?.['display']}
>{#if field?.['display']?.['html']}{@html value}{:else}{value}{/if}</svelte:element>