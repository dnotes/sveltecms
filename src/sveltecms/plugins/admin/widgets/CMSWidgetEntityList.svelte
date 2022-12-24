<script lang="ts">
import type { EntityConfigSetting, WidgetField } from "sveltecms";
import type SvelteCMS from "sveltecms";

import { tick } from "svelte";

import CmsWidgetEntity from "sveltecms/plugins/admin/widgets/CMSWidgetEntity.svelte";
import Button from "sveltecms/ui/Button.svelte";
import Modal from "sveltecms/ui/Modal.svelte";
import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";
import EntityListSectionToggle from "sveltecms/ui/EntityListSectionToggle.svelte";

  export let cms:SvelteCMS
  export let id:string
  export let field:WidgetField = undefined
  export let value:{[id:string]:string|EntityConfigSetting}
  if (typeof value === 'string') value = { default: value } // TODO: figure out why this happens with Displays
  export let url:URL
  // @ts-ignore
  export let options:{
    entityType:string,
    isTopLevelEntity?:boolean,
  } = field?.widget?.options
  let opts = Object.assign({}, options)

  let entityType = cms.getEntityType(opts.entityType)

  let items = Object.entries(value || {})

  let addIDEl
  let newEntityID
  let newEntityType
  let newEntityTypeList = cms.listEntities(entityType.id)

  let section = url?.searchParams?.get('section') || 'config'

  export function addEntity(id) {
    items = [...items, [id,id]]
  }

  async function addItem() {
    if (newEntityID) {
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

  $: value = items.length ? Object.fromEntries(items) : undefined

</script>


<fieldset class="entitylist {entityType.isDisplayable ? section : 'config'}">
  <legend>
    {#if opts.isTopLevelEntity}
      <h2>Configure {entityType.labelPlural || '[unknown entity type]s'}</h2>
    {:else}
      {field?.label || entityType?.labelPlural || `Can't find entity type`}
    {/if}
    {#if entityType.isDisplayable}
      <EntityListSectionToggle bind:section />
    {/if}
  </legend>
  {#each items as [entityID, value], i}
    <div>
      <CmsWidgetEntity
        bind:value
        bind:entityID
        {cms}
        {id}
        options={{ entityType:opts.entityType, isTopLevelEntity:opts.isTopLevelEntity }}
      >
      <Button cancel
        helptext="Remove this {entityType.label}"
        on:click={(e) => { items.splice(i,1); items=items; }}>&times;</Button>
      </CmsWidgetEntity>
    </div>
  {/each}
  <div class="add">
    <div class="field">
      <label>
        <input
          type="text"
          name="_new[id]"
          size=8
          bind:this={addIDEl}
          bind:value={newEntityID}
        >
      </label>
    </div>

    {#if entityType.typeField}
      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <CmsWidgetEntityTypeField
            {entityType}
            id="_new[type]"
            bind:value={newEntityType}
            items={newEntityTypeList}
            required={false}
            unset="choose"
          />
        </label>
      </div>
    {/if}
    <div class="cell">
      <Button primary disabled={!newEntityID || (entityType.typeField && !newEntityType)} on:click={addItem}>+ add {entityType.label}</Button>
    </div>
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

<style global>

  /* Table layout */
  .sveltecms .entitylist {
    min-width:0;
    max-width:100%;
    overflow-x:scroll;
  }
  .sveltecms .entitylist>div {
    display:flex;
    min-width:max-content;
    border: 1px solid var(--cms-border);
  }
  .sveltecms .entitylist>div.add {
    border:none;
  }

  .sveltecms .entitylist>div>div.field>label>span,
  .sveltecms .entitylist>div>div.field>div.cms-helptext {
    display:none;
  }
  .sveltecms .entitylist>div>div.field,
  .sveltecms .entitylist>div>div.cell {
    padding: .2em .5em;
    width:max-content;
    position: relative;
    border-left: 2px solid var(--cms-border);
    display: flex;
    align-items: center;
  }
  .sveltecms .entitylist>div>div>label {
    display: flex;
    align-items: center;
  }

  .sveltecms .entitylist>div.add>div.field {
    background: var(--cms-border);
  }

  .sveltecms .entitylist>div>div.field>label>input,
  .sveltecms .entitylist>div>div.field>label>select,
  .sveltecms .entitylist>div>div.field>label>textarea
  {
    border: none;
    max-width: 9em;
  }


  /* Sections (config / display) */
  .sveltecms .entitylist.config>div>div.field.display {
    display:none;
  }
  .sveltecms .entitylist.display>div>div.field.config {
    display:none;
  }



  /* The "column" headings */
  .sveltecms .entitylist>div:nth-child(2) {
    margin-top: 1.4em;
  }
  .sveltecms .entitylist>div:nth-child(2)>div.field>label>span {
    display:block;
    position:absolute;
    overflow-x:visible;
    overflow-y:hidden;
    line-height:1.2em;
    height:1.2em;
    top:-2em;
    left:50%;
    transform:translateX(-50%);
    font-family: 'Arial Narrow', Arial, sans-serif;
    text-align: center;
  }

</style>