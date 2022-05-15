<script lang="ts">
import { isEqual } from "lodash-es";
import Modal from 'sveltecms/components/Modal.svelte'

import { tick } from "svelte/internal";

import type SvelteCMS from "sveltecms";
import { Field, type FieldConfigSetting } from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let data:{[id:string]:string|FieldConfigSetting}
  export let options:{
    id?:string // e.g. `${contentType}[fields]`, or blank when configuring field types
  } = {}

  const headings = {
    // Order: 'Move the field.', // TODO: add reorder
    ID: 'The machine name of the field in data storage.',
    Type: 'The type of data stored in the field.',
    Widget: 'The widget used for data entry on a content form.',
    Tooltip: 'The help text shown to the editor on a content form.',
    'Req.': 'Whether the field is required.',
    'Mult.': 'Whether the field can have multiple values.',
    Operations: 'Edit or delete the field',
  }

  $: opts = Object.assign({
  }, options)

  let items = Object.entries(data)

  $: fieldTypeList = opts?.id ? cms.listEntities('fields') : cms.listEntities('fieldTypes')
  $: defaults = Object.fromEntries(items.map(([id,conf]) => {
    let field = new Field(id,conf,cms)
    let parentField = cms.fields[field.type] || {}
    let fieldType = cms.getEntityType('fields', field.type)
    let widgetList = cms.getFieldTypeWidgets(fieldType?.id)
    let widgetType = cms.getEntityType('widgets', field.widget.type)
    // console.log({conf,field,fieldType,widgetList,widgetType})
    let widgetOptions = cms.mergeConfigOptions(
      cms.getConfigOptionsFromFields(widgetType?.optionFields || {}),
      parentField?.['widget']?.['options'] || parentField?.['widgetOptions'] || {},
    )
    return [id,{
      field,
      parentField,
      fieldType,
      widgetList,
      widgetType,
      widgetOptions,
    }]
  }));
  $: isString = Object.fromEntries(items.map(([id,item]) => {
    return [id, typeof item === 'string']
  }));

  let addID, addType, addIDEl, fieldDetail
  let focuses = {}
  let fieldEls = {}

  async function addItem() {
    if (addID && addType) {
      items.push([addID, addType])
      items = items
      await tick()
      focuses[addID]?.focus()
      addID = ''
      addType = ''
    }
  }

  function removeItem(i:number) {
    confirmRemove = undefined
    items.splice(i, 1)
    items = items
    addIDEl.focus()
  }
  let confirmRemove:number
  let confirmRemoveButton
  $: if (typeof confirmRemove === 'number') confirmRemoveButton?.focus()

  function shiftItem(i:number, up?:true) {
    if (i === 0 && up || i === items.length-1 && !up) return
    let entry = items.splice(i,1)[0]
    let newIndex = up ? i-1 : i+1
    if (newIndex) items = [...items.splice(0, newIndex), entry, ...items]
    else items = [entry, ...items]
    items = items
  }

  async function setProp(i, prop, value) {
    let e = items[i]
    let d = defaults[e[0]]
    let f = fieldEls[e[0]]
    if (typeof e[1] === 'string') e[1] = { type: e[1] }
    if (prop === 'type') {
      e[1].type = value
      items = items
      await tick()
      // reset widgets, (etc?)
      f.type.value = d.field.widget.type
    }
    else {
      if (typeof value === 'undefined' || value === (d.parentField[prop] ?? d.fieldType[prop] ?? false)) delete e[1][prop]
      else e[1][prop] = value
    }
    if (isEqual(e[1], { type: e[1].type })) e[1] = e[1].type
    items = items
  }

  function resetItem(i) {
    items[i][1] = typeof items[i][1] === 'string' ? { type: items[i][1] } : items[i][1]?.['type']
    items = items
  }

  $: data = Object.fromEntries(items)
  // $: console.log(data)

</script>

<table>
  <tr>
    {#each Object.entries(headings) as [text, title]}
      <th {title} class={text.includes('.') ? 'center' : 'left'}>{text === 'Order' ? '' : text}</th>
    {/each}
  </tr>
  {#each items as [id, item], i}
    <tr>

      <!-- <td title={headings.Order} class="reorder">&updownarrow;</td> TODO: add reorder -->

      <td title={headings['ID']}>
        {(fieldEls[id] = {}) && ''}
        <input type="text"
        size="9"
        bind:value={id}
        disabled={!item['type'] || item['type'] === item['id']}>
      </td>

      <td title={headings['Type']}>
        <select
          value={item?.['type'] ?? item}
          bind:this={fieldEls[id].type}
          on:change={(e)=>{setProp(i,'type',e.target?.['value'])}}
        >
          {#each fieldTypeList as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </td>

      <td title={headings['Widget']}>
        <select
          value={defaults[id].field.widget.type}
          bind:this={fieldEls[id].widget}
          on:change={(e)=>{ setProp(i, 'widget', e.target?.['value']) }}
        >
          {#each defaults[id].widgetList as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </td>

      <td title={headings['Tooltip']}>
        <input
          type="text"
          size="12"
          placeholder={defaults[id].field.tooltip ? defaults[id].field.tooltip.toString() : ''}
          on:input={(e)=>{ setProp(i, 'tooltip', e.target?.['value'] || undefined) }}
        >
      </td>

      <td title={headings['Req.']} class="center">
        <input
          type="checkbox"
          bind:this = {fieldEls[id].required}
          value={defaults[id].field.required}
          on:change={(e)=>{ setProp(i, 'required', e.target?.['checked']) } }
        >
      </td>

      <td title={headings['Mult.']} class="center">
        <input
          type="checkbox"
          bind:this = {fieldEls[id].multiple}
          value={defaults[id].field.multiple}
          on:change={(e)=>{ setProp(i, 'multiple', e.target?.['checked']) } }
        >
      </td>

      <td>
        <button type="button" disabled={i===0} on:click={()=>{shiftItem(i,true)}}>&utri;</button>
        <button type="button" disabled={i===items.length-1} on:click={()=>{shiftItem(i)}}>&dtri;</button>
        <button type="button" on:click={()=>{fieldDetail=i}}>Detail</button>
        <button type="button" on:click={()=>{confirmRemove=i}}>X</button>
        {#if !isString[id]}
          <button type="button" on:click={()=>{resetItem(i)}}>Reset</button>
        {/if}
      </td>

    </tr>
  {/each}
    <!-- Add item -->
    <tr>
      <!-- <td></td> TODO: add reorder -->
      <td><input id="new-item" type="text" size="9" bind:value={addID} bind:this={addIDEl}></td>
      <td>
        <select bind:value={addType}>
          {#each fieldTypeList as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </td>
      <td>
        <button type="button" disabled={!addID || !addType} on:click={addItem}>+</button>
      </td>
    </tr>
</table>

{#if typeof confirmRemove !== 'undefined'}
  <Modal on:cancel={()=>{confirmRemove=undefined}}>
    <div><p>Are you sure you want to delete the {items[confirmRemove][0]} field?</p></div>
    <div class="center">
      <button bind:this={confirmRemoveButton} type="button" on:click={()=>{removeItem(confirmRemove)}}>Delete</button>
      <button type="button" class="cancel" on:click={()=>{confirmRemove=undefined}}>cancel</button>
    </div>
  </Modal>
{/if}

{#if typeof fieldDetail !== 'undefined'}
  <Modal on:cancel={()=>{fieldDetail=undefined}}>
    <button type="button" on:click={()=>{fieldDetail=undefined}}>Close</button>
  </Modal>
{/if}

<style>
  .center { text-align:center; }
  .left { text-align:left; }
  select { width: 100%; }
  td { padding: 2px 3px; }
  button.cancel { background:transparent; color:steelblue; border:none; }
  button { cursor:pointer; }
</style>