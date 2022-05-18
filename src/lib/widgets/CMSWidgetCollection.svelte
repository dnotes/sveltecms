<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import type { WidgetField } from "sveltecms";
import type SvelteCMS from 'sveltecms';

  let parentField:WidgetField
  let parentID = ''
  export { parentField as field, parentID as id }

  export let cms:SvelteCMS

  let opts:{oneline?:boolean} = parentField.widget.options

  // testing change: cms.getCollection(contentType, parentID) -> parentField
  // if this works we may not need to pass contentType to fields at all
  let collection = cms.getWidgetFields(parentField, {
    values: parentField.values,
    errors: parentField.errors,
    touched: parentField.touched,
    id: parentID
  })

  export let value = {}

  $: if (parentField.values || parentField.errors || parentField.touched) collection = collection

</script>

<fieldset class="collection" class:oneline={opts?.oneline}>
  {#each Object.entries(collection.fields) as [id, field] }

  <div class="field field-{field.id} {field?.class || ''}">
    {#if !field.hidden}
      {#if !field.widget.widget}
        <CmsWidgetUndefined {field} id={`${parentID}.${id}`} />
      {:else if field.multiple && !field.widget.handlesMultiple}
        <CmsWidgetMultiple
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
          {cms}
        />
      {:else if field.widget.type === 'collection'}
        <svelte:self
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
          {cms}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
        />
      {/if}
      {#if field.helptext}
        <p class="cms-helptext">{field.helptext}</p>
      {/if}
    {/if}
  </div>

  {/each}

</fieldset>
