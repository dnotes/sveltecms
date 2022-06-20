<script>export let cms;
export let field;
export let value;
$: displayValue = Array.isArray(value) ? value : [value];
</script>

{#if field?.display?.isComponent}
  {#each displayValue as value}
    <svelte:component this={cms.components[field.display.type].component} {cms} {field} {value}></svelte:component>
  {/each}
{:else}
  {#each displayValue as value}
    <svelte:element this={field.display.type}>{#if field.display?.html}{@html value}{:else}{value}{/if}</svelte:element>
  {/each}
{/if}