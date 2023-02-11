<script>import { createEventDispatcher, tick } from "svelte";
import Button from "../ui/Button.svelte";
import { cloneDeep } from "lodash-es";
import CmsWidgetUndefined from "./CMSWidgetUndefined.svelte";
import CmsWidgetMultiple from "./CMSWidgetMultiple.svelte";
let dispatch = createEventDispatcher();
export let cms;
export let id;
export let field;
export let value;
let fieldProxy = cloneDeep(field);
let fieldgroup = (Object.keys(field.fields ?? {})) ? cms.getWidgetFields(fieldProxy, {
    values: field.values,
    errors: field.errors,
    touched: field.touched,
    path: id
}) : undefined;
$: fieldgroup = (Object.keys(field.fields ?? {})) ? cms.getWidgetFields(fieldProxy, {
    values: field.values,
    errors: field.errors,
    touched: field.touched,
    path: id
}) : undefined;
$: if (!value?._meta)
    value._meta = {};
</script>

<div class="preview-container">

  <div class="preview">
    <input type="hidden" name="{id}[src]" bind:value={value['src']} />
    {#if value?._meta}
      <div class="name">{value._meta.name}</div>
      <div class="type">{value._meta.type}</div>
      <div class="size">{value._meta.size}</div>
      <input type="hidden" name="{id}[_meta][name]" bind:value={value['_meta']['name']} />
      <input type="hidden" name="{id}[_meta][type]" bind:value={value['_meta']['type']} />
      <input type="hidden" name="{id}[_meta][size]" bind:value={value['_meta']['size']} />
      <input type="hidden" name="{id}[_meta][date]" bind:value={value['_meta']['date']} />
    {/if}

    <div class="delete">
      <Button type=cancel small danger
        helptext="Delete audio file {value['_meta']['name']}"
        on:click="{() => {dispatch('delete')}}"
      />
    </div>

  </div>

  <div class="fields">

    {#each Object.entries(fieldgroup?.fields || {}) as [subid, field] }

    <div class="field field-{field.id} field-type-{field.type} widget-type-{field.widget.type} {field?.class || ''}">
      {#if !field.hidden}
        {#if !field.widget.widget}
          <CmsWidgetUndefined {field} id="{id}.{subid}" />
        {:else if field.multiple && !field.widget.handlesMultiple}
          <CmsWidgetMultiple
            {field}
            id="{id}.{subid}"
            bind:value={value[subid]}
            {cms}
          />
        {:else if field.widget.type === 'fieldgroup'}
          <svelte:self
            {field}
            id="{id}.{subid}"
            bind:value={value[subid]}
            {cms}
          />
        {:else}
          <svelte:component
            this={field.widget.widget}
            {field}
            id="{id}.{subid}"
            bind:value={value[subid]}
            {cms}
          />
        {/if}
        {#if field.helptext}
          <p class="cms-helptext">{field.helptext}</p>
        {/if}
      {/if}
    </div>

    {/each}

  </div>

</div>

<style>
  .preview-container {
    display:flex;
    flex-direction:column;
    max-width:500px;
    padding:9px;
    background: rgba(126,126,126,.3);
    border-radius: 12px;
  }
  .preview {
    position:relative;
  }
  .delete { position:absolute; top:5px; right:5px; }

  .fields { width:100%; }
  .fields :global(fieldset),
  .fields :global(input),
  .fields :global(textarea),
  .fields :global(select) {
    line-height: 1.2em;
    font-size: 90%;
    width: 100%;
    max-width: 500px;
  }</style>