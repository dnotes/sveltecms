<script lang="ts">
import { tick } from "svelte";

import type { EntityConfigSetting, WidgetField } from "sveltecms";

import type SvelteCMS from "sveltecms";
import type { FieldConfigSetting } from "sveltecms/core/Field";

import CmsWidgetEntity from "sveltecms/plugins/admin/widgets/CMSWidgetEntity.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";
import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";

  export let cms:SvelteCMS
  export let id:string
  export let field:WidgetField = undefined
  export let value:{[id:string]:string|EntityConfigSetting}
  // @ts-ignore
  export let options:{
    entityType:string,
    isTopLevelEntity?:boolean,
  } = field?.widget?.options || {}
  let opts = Object.assign({}, options)

  let entityType = cms.getEntityType(opts.entityType)

  let items = Object.entries(value || {})

  let collapsedItems = items.map(i=>true)

  let addIDEl
  let newEntityID
  let newEntityType
  let newEntityTypeList = cms.listEntities(entityType.id)

  async function addItem() {
    if (newEntityID) {
      collapsedItems[items.length] = true
      items.push([newEntityID, newEntityType])
      items = items
      await tick()
      newEntityID = undefined
      newEntityType = undefined
      addIDEl.focus()
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

  function resetItem(i:number) {
    items[i][1] = items[i][0]
  }

  $: value = Object.fromEntries(items)

</script>

<fieldset class="multiple">
  <legend>{entityType?.labelPlural || `Can't find entity type`}</legend>
  {#each items as [entityID, value], i}
    <div class="multiple-item">
      <CmsWidgetEntity
        bind:value
        bind:entityID
        {cms}
        {id}
        collapsed={collapsedItems[i]}
        options={{ entityType:opts.entityType, isTopLevelEntity:opts.isTopLevelEntity }}
      />
      <div class="delete">
        <Button cancel
          helptext="{collapsedItems[i] ? 'Show' : 'Hide'} this {entityType.label}"
          on:click={() => { collapsedItems[i] = !collapsedItems[i] }}>{#if collapsedItems[i]}&ltri;{:else}&dtri;{/if}</Button>
        <Button cancel
          helptext="Remove this {entityType.label}"
          on:click={(e) => { items.splice(i,1); items=items; }}>&times;</Button>
      </div>
    </div>
  {/each}
  <div class="multiple-item">
    <fieldset class="fieldgroup collapsed">
      <legend>
        <label><em>{entityType.label || 'unknown entity'} &nbsp;</em>
          <input
            type="text"
            name="_new[id]"
            size=8
            bind:this={addIDEl}
            bind:value={newEntityID}
          >
        </label>

        {#if entityType.typeField}
          <CmsWidgetEntityTypeField
            {entityType}
            id="_new[type]"
            bind:value={newEntityType}
            items={newEntityTypeList}
            required={false}
            unset="choose"
          />
        {/if}
        <Button primary disabled={!newEntityID || (entityType.typeField && !newEntityType)} on:click={addItem}>+ add</Button>
      </legend>
    </fieldset>
  </div>
</fieldset>

{#if typeof confirmRemove !== 'undefined'}
  <!-- Remove Field Confirmation -->
  <Modal on:cancel={()=>{confirmRemove=undefined}}>
    <div><p>Are you sure you want to delete the {items[confirmRemove][0]} configuration?</p></div>
    <div class="center">
      <Button primary on:click={()=>{removeItem(confirmRemove)}}>Delete</Button>
      <Button on:click={()=>{confirmRemove=undefined}}>cancel</Button>
    </div>
  </Modal>
{/if}

