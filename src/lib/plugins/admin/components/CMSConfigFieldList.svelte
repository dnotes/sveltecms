<script lang="ts">
import { isEqual } from "lodash-es";
import Modal from 'sveltecms/ui/Modal.svelte'
import Button from 'sveltecms/ui/Button.svelte'
import ConfigurableEntityWidget from 'sveltecms/plugins/admin/widgets/CMSWidgetConfigurableEntity.svelte'

import { tick } from "svelte/internal";

import type SvelteCMS from "sveltecms";
import { Field, type FieldConfigSetting } from "sveltecms/core/Field";
import AddItemLine from "sveltecms/ui/AddItemLine.svelte";
import ScriptableButton from "sveltecms/ui/ScriptableButton.svelte";

  export let cms:SvelteCMS
  export let data:{[id:string]:string|FieldConfigSetting} = {}
  export let options:{
    id?:string // e.g. `${contentType}[fields]`, or blank when configuring field types
  } = {}
  let opts = Object.assign({}, options)

  const headings = {
    // Order: 'Move the field.', // TODO: add reorder
    ID: 'The machine name of the field in data storage.',
    Type: 'The type of data stored in the field.',
    Widget: 'The widget used for data entry on a content form.',
    MediaStore: 'The Media Store used for any uploaded media',
    Helptext: 'The help text shown to the editor on a content form. Plain text only, no html.',
    'Req.': 'Whether the field is required.',
    'Mult.': 'Whether the field can have multiple values.',
    Operations: 'Edit or delete the field',
  }

  // All field configuration, as an array
  let items = Object.entries(data)

  // List all mediastores, as these are common to all fields
  let mediaStores = cms.listEntities('mediaStores')

  // Variables for the elements where new lines are added
  let addID, addType, addIDEl

  let fieldEls = {}
  let isScript = {}
  $: items.forEach(([id]) => {
    if (!fieldEls[id]) fieldEls[id] = {}
    if (!isScript[id]) isScript[id] = {}
  })

  // Get the list of field configurations, for the 'type' select options
  // This is fieldTypes only for admin/fields, and a full list when in context of another form
  $: fieldTypeList = opts?.id ? cms.listEntities('fields') : cms.listEntities('fieldTypes')

  // Get defaults for each field type
  $: defaults = Object.fromEntries(items.map(([id,conf]) => {

    // A genuine Field object, which makes config easier
    let field = new Field(id,conf,cms)

    // The parent field, if it is not a direct descendant of a field type (TODO: is this needed?)
    let parentField = cms.fields[field.type] || {}

    // The fieldTypes ancestor of the field
    let fieldType = cms.getEntityType('fields', field.type)

    // A list of widgets available for the field type
    let widgetList = cms.getFieldTypeWidgets(fieldType?.id)

    // Whether the item is a default configuration (i.e. a string)
    let isString = typeof conf === 'string'

    return [id,{ field, parentField, fieldType, widgetList, isString }]
  }));

  // Variables for the detail modal
  let fieldDetailIndex
  $: detailID = items?.[fieldDetailIndex]?.[0]
  $: detail = items?.[fieldDetailIndex]?.[1]

  // Get the "id" variable to pass to fieldable fields, for the "name" attribute of inputs
  function getFieldFormID(id:string) { return opts?.id ? `${opts.id}[${id}]` : id }

  async function addItem() {
    if (addID && addType) {
      items.push([addID, addType])
      items = items
      await tick()
      fieldEls[addID].widget?.focus()
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
  // Variables for the remove item modal
  let confirmRemove:number
  let confirmRemoveButton
  // TODO $: if (typeof confirmRemove === 'number') confirmRemoveButton?.focus()
  // Move items up or down
  // TODO: refactor into a draggable list
  function shiftItem(i:number, up?:true) {
    if (i === 0 && up || i === items.length-1 && !up) return
    let entry = items.splice(i,1)[0]
    let newIndex = up ? i-1 : i+1
    if (newIndex) items = [...items.splice(0, newIndex), entry, ...items]
    else items = [entry, ...items]
    items = items
  }

  // Function to set a field property for one-way binding
  // This is done so that defaults are not duplicated for every field
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
      // @TODO: refactor for recursive types?
      if (typeof value === 'undefined' || value === (d.parentField[prop] ?? d.fieldType[prop] ?? false)) delete e[1][prop]
      else e[1][prop] = value
    }
    if (isEqual(e[1], { type: e[1].type })) e[1] = e[1].type
    items = items
  }

  // Function to reset a field to default config
  function resetItem(i) {
    items[i][1] = typeof items[i][1] === 'string' ? { type: items[i][1] } : items[i][1]?.['type']
    items = items
  }

  // Whenever items changes, data must change as well.
  $: data = Object.fromEntries(items)

</script>

<table>
  <tr>
    {#each Object.entries(headings) as [text, title]}
      <th {title} class={text.includes('.') ? 'center' : 'left'}>{text === 'Order' ? '' : text}</th>
    {/each}
  </tr>
  {#each items as [id, item], i}
    <tr>

      <td title={headings['ID']}>
        <input type="text"
        size="9"
        bind:value={id}>
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
        <ConfigurableEntityWidget
          {cms}
          {id}
          type="widgets"
          value={item?.['widget'] ?? defaults[id]?.parentField?.['widget']?.['type'] ?? defaults[id]?.fieldType?.widget?.type ?? defaults[id]?.fieldType?.widget}
          items={defaults[id].widgetList}
          on:change={(e)=>{ setProp(i, 'widget', e?.detail?.['value']) }}
        />
      </td>

      <td title={headings['MediaStore']}>
        {#if defaults[id].field.widget.handlesMedia}
          <ConfigurableEntityWidget
            {cms}
            {id}
            type="mediaStores"
            value={item?.['mediaStore'] || ''}
            items={mediaStores}
            unset="- default -"
            on:change={(e)=>{ setProp(i, 'mediaStore', e?.detail?.['value']) }}
          />
        {:else}
          <em class="disabled">- none -</em>
        {/if}
      </td>

      <td title={headings['Helptext']}>
        <input
          type="text"
          size="12"
          placeholder={defaults[id].field.helptext ? defaults[id].field.helptext.toString() : ''}
          on:input={(e)=>{ setProp(i, 'helptext', e.target?.['value'] || undefined) }}
        >
      </td>

      <td title={headings['Req.']} class="center">
        <input
          type="checkbox"
          disabled={isScript[id].disabled}
          bind:this = {fieldEls[id].required}
          value={defaults[id].field.required}
          on:change={(e)=>{ setProp(i, 'required', e.target?.['checked']) } }
        >
        <ScriptableButton
          {cms}
          label="{id}.required"
          value={defaults[id].field.required}
          default={false}
          bind:isScript={isScript[id].disabled}
        />
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
        <Button small disabled={i===0} on:click={()=>{shiftItem(i,true)}}>&utri;</Button>
        <Button small disabled={i===items.length-1} on:click={()=>{shiftItem(i)}}>&dtri;</Button>
        <Button small on:click={()=>{fieldDetailIndex=i}}>Detail</Button>
        <Button small on:click={()=>{confirmRemove=i}}>X</Button>
        {#if !defaults[id].isString}
          <Button small on:click={()=>{resetItem(i)}}>Reset</Button>
        {/if}
      </td>

    </tr>
    {#if defaults[id].field.isFieldable}
      <tr>
        <td></td>
        <td colspan="6">
          <svelte:self {cms} data={item?.['fields']} options={{id:getFieldFormID(id) + '[fields]'}} />
        </td>
      </tr>
    {/if}
  {/each}
</table>

<AddItemLine>
  <input
    id="new-item"
    type="text"
    size="9"
    placeholder="new field"
    bind:value={addID}
    bind:this={addIDEl}
  >

  <select bind:value={addType}>
    {#each fieldTypeList as type}
      <option value={type}>{type}</option>
    {/each}
  </select>

  <Button primary disabled={!addID || !addType} on:click={addItem}>+ add</Button>

</AddItemLine>

{#if typeof confirmRemove !== 'undefined'}
  <!-- Remove Field Confirmation -->
  <Modal on:cancel={()=>{confirmRemove=undefined}}>
    <div><p>Are you sure you want to delete the {items[confirmRemove][0]} field?</p></div>
    <div class="center">
      <Button bind:this={confirmRemoveButton} danger on:click={()=>{removeItem(confirmRemove)}}>Delete</Button>
      <Button on:click={()=>{confirmRemove=undefined}}>cancel</Button>
    </div>
  </Modal>
{/if}

{#if typeof fieldDetailIndex !== 'undefined'}
  <!-- Field Detail Form -->
  <Modal on:cancel={()=>{fieldDetailIndex=undefined}}>
    <h2>Field Detail: <code>{detailID}</code></h2>

    <div class="field"><label>
      <span>Type</span>
      <select
        value={detail?.['type'] ?? detail}
        on:change={(e)=>{setProp(fieldDetailIndex, 'type', e.target?.['value'])}}
      >
        {#each fieldTypeList as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </label></div>

    <div class="field"><label>
      <span>Label</span>
      <input type="text"
        value={detail?.['label']}
        placeholder={defaults[detailID].field.label ? defaults[detailID].field.label.toString() : ''}
        on:change={(e)=>{ setProp(fieldDetailIndex, 'label', e.target?.['value'] )}}
      >
    </label></div>

    <div class="field"><label>
      <span>Helptext</span>
      <input type="text"
        value={detail?.['helptext']}
        placeholder={defaults[detailID].field.helptext ? defaults[detailID].field.helptext.toString() : ''}
        on:change={(e)=>{ setProp(fieldDetailIndex, 'helptext', e.target?.['value'] )}}
      >
    </label></div>

    <div class="field"><label>
      <span>Widget</span>
      <select
        value={detail?.['widget'] ?? defaults[detailID].field.widget.type}
        on:change={(e)=>{ setProp(fieldDetailIndex, 'widget', e.target?.['value']) }}
      >
        {#each defaults[detailID].widgetList as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </label></div>

    {#if defaults[detailID].field.widget.handlesMedia}
      <div class="field"><label>
        <span>Media Store</span>
        <select
          value={detail?.['mediaStore']?.['type'] ?? detail?.['mediaStore'] ?? ''}
          on:change={(e)=>{ setProp( fieldDetailIndex, 'mediaStore', e.target?.['value'] || undefined )}}
        >
          <option value="">- unspecified -</option>
          {#each mediaStores as type}
            <option value="{type}">{type}</option>
          {/each}
        </select>
      </label></div>
    {/if}

    <div class="field"><label>
      <span>Required</span>
      <input
        type="checkbox"
        value={detail?.['required'] ?? defaults[detailID].field.required}
        on:change={(e)=>{ setProp(fieldDetailIndex, 'required', e.target?.['checked']) } }
      >
    </label></div>

    <div class="field"><label>
      <span>Multiple</span>
      <input
        type="checkbox"
        value={detail?.['multiple'] ?? defaults[detailID].field.multiple}
        on:change={(e)=>{ setProp(fieldDetailIndex, 'multiple', e.target?.['checked']) } }
      >
    </label></div>

    {#if defaults[detailID].field.isFieldable}
      <h2>Fields:</h2>
      <svelte:self {cms} data={detail?.['fields']} options={{id:`${getFieldFormID(detailID)}[fields]`}} />
    {/if}

    <div class="center"><Button on:click={()=>{fieldDetailIndex=undefined}}>Close</Button></div>
  </Modal>
{/if}
