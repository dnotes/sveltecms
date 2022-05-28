<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import type { WidgetField, WidgetFieldCollection } from "sveltecms";
import type SvelteCMS from 'sveltecms';
import { cloneDeep } from 'lodash-es';
import splitTags from 'sveltecms/utils/splitTags'
const split = splitTags()

  let parentField:WidgetField
  let parentID = ''
  export { parentField as field, parentID as id }
  export let cms:SvelteCMS
  export let value = {}

  let originalValue = Object.assign({}, value)

  let collections = typeof parentField.widget.options.collections === 'string' ?
    split(parentField.widget.options.collections) :
    (parentField.widget.options.collections || [])
  let collectionTypes = typeof parentField.widget.options.collectionTypes === 'string' ?
    split(parentField.widget.options.collectionTypes) :
    (parentField.widget.options.collectionTypes || [])
  let opts:{
    collections:string[]
    collectionTypes:string[]
    oneline?:boolean
  } = Object.assign({}, parentField.widget.options, { collections, collectionTypes })

  let parentFieldProxy:WidgetField = cloneDeep(parentField)
  let collection:WidgetFieldCollection

  let isSelectable = [...opts.collections, ...opts.collectionTypes].length

  $: collectionTypes = Object.entries(cms.collections)
    .filter(([id,collection])=>opts.collectionTypes.includes(collection?.['type']) || opts.collections.includes(id))

  $: selectedFields = value?.['_collectionType'] ?
      (cms.collections?.[value['_collectionType']]?.fields || {}) :
      {}

  $: if (selectedFields) parentFieldProxy.fields = Object.assign(
    {},
    parentField.fields || {},
    selectedFields || {}
  )

  $: if (parentFieldProxy.fields || parentField.values || parentField.errors || parentField.touched ) collection = cms.getWidgetFields(parentFieldProxy, {
    values: parentField.values,
    errors: parentField.errors,
    touched: parentField.touched,
    id: parentID
  })

</script>

<fieldset class="collection" class:oneline={opts?.oneline}>

  {#if isSelectable}
    <label>
      Collection:
      <select
        name="{parentID}._collectionType"
        bind:value={value['_collectionType']}
      >
        {#each collectionTypes as [id,collection]}
          <option value="{id}">{id}</option>
        {/each}
      </select>
    </label>
  {/if}

  {#each Object.entries(collection?.fields || {}) as [id, field] }

  <div class="field field-{field.id} {field?.class || ''}">
    {#if !field.hidden}
      {#if !field.widget.widget}
        <CmsWidgetUndefined {field} id="{parentID}.{id}" />
      {:else if field.multiple && !field.widget.handlesMultiple}
        <CmsWidgetMultiple
          {field}
          id="{parentID}.{id}"
          bind:value={value[id]}
          {cms}
        />
      {:else if field.widget.type === 'collection'}
        <svelte:self
          {field}
          id="{parentID}.{id}"
          bind:value={value[id]}
          {cms}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id="{parentID}.{id}"
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
