<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { ComponentType } from "sveltecms/core/Component";
import type Component from "sveltecms/core/Component";
import type { Field, FieldConfigSetting } from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let field:Field
  export let value

  $: displayValue = Array.isArray(value) ? value : [value]

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