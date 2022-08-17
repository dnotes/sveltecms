<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import type { WidgetField, WidgetFieldFieldgroup } from "sveltecms";
import type SvelteCMS from 'sveltecms';
import { cloneDeep, get } from 'lodash-es';
import splitTags from 'sveltecms/utils/splitTags'
import Button from 'sveltecms/ui/Button.svelte';
const split = splitTags()

  let parentField:WidgetField
  let parentID = ''
  export { parentField as field, parentID as id }
  export let cms:SvelteCMS
  export let value = {}
  export let collapsed = undefined

  let originalValue = Object.assign({}, value)

  let fieldgroups = typeof parentField.widget.options.fieldgroups === 'string' ?
    split(parentField.widget.options.fieldgroups) :
    (parentField.widget.options.fieldgroups || [])
  let fieldgroupTypes = typeof parentField.widget.options.fieldgroupTypes === 'string' ?
    split(parentField.widget.options.fieldgroupTypes) :
    (parentField.widget.options.fieldgroupTypes || [])
  let opts:{
    fieldgroups:string[]
    fieldgroupTypes:string[]
    oneline?:boolean
  } = Object.assign({}, parentField.widget.options, { fieldgroups, fieldgroupTypes })

  let parentFieldProxy:WidgetField = cloneDeep(parentField)
  let fieldgroup:WidgetFieldFieldgroup

  let isSelectable = [...opts.fieldgroups, ...opts.fieldgroupTypes].length

  let label = parentField.label
  $: if (parentField.multipleLabelFields?.['length'] && value) label = Array.isArray(parentField.multipleLabelFields) ?
    parentField.multipleLabelFields.map(s=>s?.toString()) :
    split(parentField?.multipleLabelFields?.toString()).map(id => get(value, id) ?? id).join(', ')

  $: fieldgroupTypes = Object.entries(cms.fieldgroups)
    .filter(([id,fieldgroup])=>opts.fieldgroupTypes.includes(fieldgroup?.['type']) || opts.fieldgroups.includes(id))

  $: selectedFields = value?.['_fieldgroup'] ?
      (cms.fieldgroups?.[value['_fieldgroup']]?.fields || {}) :
      {}

  $: if (selectedFields) parentFieldProxy.fields = Object.assign(
    {},
    parentField.fields || {},
    selectedFields || {}
  )

  $: if (parentFieldProxy.fields || parentField.values || parentField.errors || parentField.touched ) fieldgroup = cms.getWidgetFields(parentFieldProxy, {
    values: parentField.values,
    errors: parentField.errors,
    touched: parentField.touched,
    id: parentID
  })

</script>

<fieldset class="fieldgroup" class:oneline={opts?.oneline} class:collapsed>

  <legend><Button highlight on:click={()=>{collapsed=!collapsed}}>{label}</Button></legend>

  {#if isSelectable}
    <label class="fieldgroup-type">
      Fieldgroup Type:
      <select
        name="{parentID}._fieldgroup"
        bind:value={value['_fieldgroup']}
      >
        {#each fieldgroupTypes as [id,fieldgroup]}
          <option value="{id}">{id}</option>
        {/each}
      </select>
    </label>
  {/if}

  {#each Object.entries(fieldgroup?.fields || {}) as [id, field] }

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
      {:else if field.widget.type === 'fieldgroup'}
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

<style global>
  .sveltecms fieldset.fieldgroup>.fieldgroup-type {
    background: var(--cms-main);
    color: var(--cms-background);
  }
  .sveltecms fieldset.fieldgroup {
    background: var(--cms-main);
  }
  .sveltecms fieldset.fieldgroup .field {
    background: var(--cms-background);
  }
  .sveltecms fieldset.fieldgroup.collapsed {
    background: transparent;
    border-top: 3px solid var(--cms-main);
  }
  .sveltecms fieldset.fieldgroup.collapsed>div>.field,
  .sveltecms fieldset.fieldgroup.collapsed>.fieldgroup-type {
    display: none;
  }
</style>