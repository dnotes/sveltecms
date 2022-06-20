<script>export let cms;
export let display;
</script>

{#if display.isComponent}
  <svelte:component this={cms.components[display.type].component}><slot></slot></svelte:component>
{:else}
  <svelte:element this={display.type}><slot></slot></svelte:element>
{/if}