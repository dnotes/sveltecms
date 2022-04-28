<script lang="ts">
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetCollection from './widgets/CMSWidgetCollection.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import type SvelteCMS from 'sveltecms';
import type { CMSWidgetField } from 'sveltecms';

export let cms:SvelteCMS
export let fieldList:{[id:string]:CMSWidgetField}
export let values
export let contentTypeID:string

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
