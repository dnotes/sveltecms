<script >import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
let parentField;
let parentID = '';
export { parentField as field, parentID as id };
export let cms;
export let contentTypeID;
let opts = parentField.widget.options;
let collection = cms.getWidgetFields(cms.getCollection(contentTypeID, parentID), {
    values: parentField.values,
    errors: parentField.errors,
    touched: parentField.touched,
    id: parentID
});
export let value = {};
$: if (parentField.values || parentField.errors || parentField.touched)
    collection = collection;
</script>

<fieldset class="collection" class:oneline={opts?.oneline}>
  {#each Object.entries(collection.fields) as [id, field] }

  <div class="field {field?.class || ''}">
    {#if !field.hidden}
      {#if !field.widget.widget}
        <CmsWidgetUndefined {field} id={`${parentID}.${id}`} />
      {:else if field.multiple && !field.widget.handlesMultiple}
        <CmsWidgetMultiple
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
          {cms}
          {contentTypeID}
        />
      {:else if field.widget.type === 'collection'}
        <svelte:self
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
          {cms}
          {contentTypeID}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id={`${parentID}.${id}`}
          bind:value={value[id]}
        />
      {/if}
    {/if}
  </div>

  {/each}

</fieldset>
