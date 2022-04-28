<script>import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetCollection from './widgets/CMSWidgetCollection.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
export let cms;
export let fieldList;
export let values;
export let contentTypeID;
</script>

{#each Object.entries(fieldList) as [id,field]}
{#if !field.hidden}
  <div class="field field-{field.id} {field?.class || ''}">
    {#if !field.widget.widget}
      <CmsWidgetUndefined {field} {id} />
    {:else if field.multiple && !field.widget.handlesMultiple}
      <CmsWidgetMultiple
        {field}
        {id}
        bind:value={values[id]}
        {cms}
        {contentTypeID}
      />
    {:else if field.widget.type === 'collection'}
      <CmsWidgetCollection
        {field}
        {id}
        bind:value={values[id]}
        {cms}
        {contentTypeID}
      />
    {:else}
      <svelte:component
        this={field.widget.widget}
        {field}
        {id}
        bind:value={values[id]}
      />
    {/if}
  </div>
{/if}
{:else}
There are no fields to edit.
{/each}
