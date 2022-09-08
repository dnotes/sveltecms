<script>// import CmsWidgetFieldgroup from "../../../widgets/CMSWidgetFieldgroup.svelte";
// import CmsWidgetMultiple from "../../../widgets/CMSWidgetMultiple.svelte";
// import CmsWidgetUndefined from "../../../widgets/CMSWidgetUndefined.svelte";
// export let cms:SvelteCMS
// export let field:WidgetField = undefined
export let entityType;
export let items = [];
export let value;
export let id;
export let required = entityType?.typeRequired;
export let unset = 'use default';
export let placeholder = '';
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
