<script lang="ts">
  import type { Media } from "sveltecms/core/MediaStore"
  import { createEventDispatcher } from "svelte";
  import Button from "sveltecms/ui/Button.svelte";
  import type SvelteCMS from "sveltecms";
  import type { WidgetField } from "sveltecms";
  import { cloneDeep } from "lodash-es";
  import CmsWidgetUndefined from "./CMSWidgetUndefined.svelte";
  import CmsWidgetMultiple from "./CMSWidgetMultiple.svelte";

  let dispatch = createEventDispatcher()

  export let cms:SvelteCMS
  export let id:string
  export let field:WidgetField
  export let value:Media

  let img:HTMLImageElement

  let fieldProxy = cloneDeep(field)

  let fieldgroup = (Object.keys(field.fields ?? {})) ? cms.getWidgetFields(fieldProxy, {
    values: field.values,
    errors: field.errors,
    touched: field.touched,
    path: id
  }) : undefined
  $: fieldgroup = (Object.keys(field.fields ?? {})) ? cms.getWidgetFields(fieldProxy, {
    values: field.values,
    errors: field.errors,
    touched: field.touched,
    path: id
  }) : undefined

  $: if (!value?._meta) value._meta = {}

</script>

<div class="preview-container">

  <div class="preview-img">
    <img
      src="{value.src}"
      alt="{value?.['alt']?.toString() ?? ''}"
    />
    <input type="hidden" name="{id}[src]" bind:value={value['src']} />
    {#if value?._meta}
      <input type="hidden" name="{id}[_meta][name]" bind:value={value['_meta']['name']} />
      <input type="hidden" name="{id}[_meta][type]" bind:value={value['_meta']['type']} />
      <input type="hidden" name="{id}[_meta][size]" bind:value={value['_meta']['size']} />
      <input type="hidden" name="{id}[_meta][date]" bind:value={value['_meta']['date']} />
      <input type="hidden" name="{id}[_meta][width]" bind:value={value['_meta']['width']} />
      <input type="hidden" name="{id}[_meta][height]" bind:value={value['_meta']['height']} />
    {/if}

    <div class="delete">
      <Button type=cancel small danger
        helptext="Delete image {value['_meta']['name']}"
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
          />
        {/if}
        {#if field.helptext}
          <p class="cms-helptext">{field.helptext}</p>
        {/if}
      {/if}
    </div>

    {/each}

  </div>

  <div class="preview-img-hidden">
    <img bind:this={img} src="{value.src}" alt="" on:load={()=>{
      value._meta.height=img.height
      value._meta.width=img.width
    }} />
  </div>

</div>

<style>
  .preview-container {
    display:flex;
    flex-wrap:wrap;
    padding:9px;
    background: rgba(126,126,126,.3);
    border-radius: 12px;
    justify-content: center;
  }
  .preview-img {
    width:144px;
    height:144px;
    position:relative;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .preview-img img {
    max-width:100%;
    max-height:100%;
    width:auto;
    height:auto;
  }
  .preview-img-hidden {
    position:fixed;
    left: -9999px;
    opacity:0;
    user-select:none;
    pointer-events:none;
  }
  .delete { position:absolute; top:5px; right:5px; }

  .fields { flex-grow:1; }
  .fields :global(fieldset),
  .fields :global(input),
  .fields :global(textarea),
  .fields :global(select) {
    line-height: 1.2em;
    font-size: 90%;
    width: 100%;
    max-width: 500px;
  }
</style>