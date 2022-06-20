<script>export let entityType;
export let items = [];
export let value;
export let id;
export let required = entityType?.typeRequired;
</script>

{#if entityType?.typeRestricted}
  <select
    name="{id}"
    bind:value
    on:change
    {required}
  >
    {#if !required}
      <option value="">- use default -</option>
    {/if}
    {#each items as opt}
      <option value="{opt}">{opt}</option>
    {/each}
  </select>
{:else}
  <input
    name="{id}"
    bind:value
    on:change
    type="text"
    {required}
  >
{/if}
