<script lang="ts">

import type SvelteCMS from "sveltecms";
import type { Field, FieldConfigSetting } from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let entity:Field
  export let item

  $: items = Array.isArray(item) ? item : [item]

</script>

{#if entity?.display?.component}
  {#each items as value}
    <svelte:component
      this={entity.display.component.component}
      {cms}
      {entity}
      item={value}
    />
  {/each}
{:else}
  {#each items as value}
    <svelte:element
      this={entity.display.tag}
      id={entity.display.id}
      class="field-{entity.id} field-type-{entity.type} {entity.display.classList}"
    >{#if entity.display?.html}{@html value}{:else}{value}{/if}</svelte:element>
  {/each}
{/if}