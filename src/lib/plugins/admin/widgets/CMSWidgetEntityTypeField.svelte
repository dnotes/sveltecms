<script lang="ts">
import type { EntityTemplate } from "sveltecms/core/EntityTemplate";

  export let entityType:EntityTemplate
  export let items:string[] = []
  export let value:string
  export let id:string
  export let required = entityType?.typeRequired

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
