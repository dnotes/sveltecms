<script lang="ts">
import { tick } from "svelte";

import type { EntityConfigSetting, WidgetField } from "sveltecms";

import type SvelteCMS from "sveltecms";
import type { FieldConfigSetting } from "sveltecms/core/Field";

import CmsWidgetEntity from "sveltecms/plugins/admin/widgets/CMSWidgetEntity.svelte";
import AddItemLine from "sveltecms/ui/AddItemLine.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";

  export let cms:SvelteCMS
  export let id:string
  export let field:WidgetField = undefined
  export let value:{[id:string]:string|EntityConfigSetting}
  // @ts-ignore
  export let options:{
    entityType:string,
  } = field?.widget?.options || {}
  let opts = Object.assign({}, options)

  let entityType = cms.getEntityType(opts.entityType)

  let items = Object.entries(value || {})

  let collapsedItems = items.map(i=>true)

  let newEntity = {}
  let newEntityID = ""
  let addIDEl

  async function addItem() {
    if (newEntityID) {
      collapsedItems[items.length] = true
      items.push([newEntityID, newEntity])
      items = items
      await tick()
      newEntityID = ''
      newEntity = {}
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
        options={{ entityType:opts.entityType }}
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
    <CmsWidgetEntity
      bind:entityID={newEntityID}
      bind:value={newEntity}
      bind:idElement={addIDEl}
      {cms}
      id="_new"
      collapsed
      options={{ entityType:opts.entityType, skipDetail:true }}
    >
      <Button primary disabled={!newEntityID} on:click={addItem}>+ add</Button>
    </CmsWidgetEntity>
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

