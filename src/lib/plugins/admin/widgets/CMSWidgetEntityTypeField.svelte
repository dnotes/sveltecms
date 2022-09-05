<script lang="ts">
// TODO: make this work with custom typeField as defined in EntityTemplate.configFields
// import type { WidgetField } from "sveltecms";
// import type SvelteCMS from "sveltecms";
import type { EntityTemplate } from "sveltecms/core/EntityTemplate";

// import CmsWidgetFieldgroup from "sveltecms/widgets/CMSWidgetFieldgroup.svelte";
// import CmsWidgetMultiple from "sveltecms/widgets/CMSWidgetMultiple.svelte";
// import CmsWidgetUndefined from "sveltecms/widgets/CMSWidgetUndefined.svelte";

  // export let cms:SvelteCMS
  // export let field:WidgetField = undefined
  export let entityType:EntityTemplate
  export let items:string[] = []
  export let value:string
  export let id:string
  export let required:boolean = entityType?.typeRequired
  export let unset:string = 'use default'
  export let placeholder:string = ''

</script>

{#if entityType?.typeRestricted}
  <select
    name="{id}"
    bind:value
    on:change
    {required}
    {placeholder}
  >
    {#if !required}
      <option value="">- {unset} -</option>
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
    {placeholder}
    {required}
  >
{/if}
