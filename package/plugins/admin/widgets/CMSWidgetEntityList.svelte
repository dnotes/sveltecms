<script>import { tick } from "svelte";
import CmsWidgetEntity from "./CMSWidgetEntity.svelte";
import Button from "../../../ui/Button.svelte";
import Modal from "../../../ui/Modal.svelte";
import CmsWidgetEntityTypeField from "./CMSWidgetEntityTypeField.svelte";
import EntityListSectionToggle from "../../../ui/EntityListSectionToggle.svelte";
export let cms;
export let id;
export let field = undefined;
export let value;
if (typeof value === 'string')
    value = { default: value }; // TODO: figure out why this happens with Displays
export let url;
// @ts-ignore
export let options = field?.widget?.options;
let opts = Object.assign({}, options);
let entityType = cms.getEntityType(opts.entityType);
let items = Object.entries(value || {});
let addIDEl;
let newEntityID;
let newEntityType;
let newEntityTypeList = cms.listEntities(entityType.id);
let section = url?.searchParams?.get('section') || 'config';
export function addEntity(id) {
    items = [...items, [id, id]];
}
async function addItem() {
    if (newEntityID) {
        items.push([newEntityID, newEntityType]);
        items = items;
        await tick();
        newEntityID = undefined;
        newEntityType = undefined;
        addIDEl.focus();
    }
}
function removeItem(i) {
    confirmRemove = undefined;
    items.splice(i, 1);
    items = items;
    addIDEl.focus();
}
// Variables for the remove item modal
let confirmRemove;
$: value = items.length ? Object.fromEntries(items) : undefined;
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
  :global(.sveltecms) :global(.entitylist) {
    min-width:0;
    max-width:100%;
    overflow-x:scroll;
  }
  :global(.sveltecms) :global(.entitylist)>:global(div) {
    display:flex;
    min-width:-moz-max-content;
    min-width:max-content;
    border: 1px solid var(--cms-border);
  }
  :global(.sveltecms) :global(.entitylist)>:global(div.add) {
    border:none;
  }

  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field)>:global(label)>:global(span),
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field)>:global(div.cms-helptext) {
    display:none;
  }
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field),
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.cell) {
    padding: .2em .5em;
    width:-moz-max-content;
    width:max-content;
    position: relative;
    border-left: 2px solid var(--cms-border);
    display: flex;
    align-items: center;
  }
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div)>:global(label) {
    display: flex;
    align-items: center;
  }

  :global(.sveltecms) :global(.entitylist)>:global(div.add)>:global(div.field) {
    background: var(--cms-border);
  }

  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field)>:global(label)>:global(input),
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field)>:global(label)>:global(select),
  :global(.sveltecms) :global(.entitylist)>:global(div)>:global(div.field)>:global(label)>:global(textarea)
  {
    border: none;
    max-width: 9em;
  }


  /* Sections (config / display) */
  :global(.sveltecms) :global(.entitylist.config)>:global(div)>:global(div.field.display) {
    display:none;
  }
  :global(.sveltecms) :global(.entitylist.display)>:global(div)>:global(div.field.config) {
    display:none;
  }



  /* The "column" headings */
  :global(.sveltecms) :global(.entitylist)>:global(div:nth-child(2)) {
    margin-top: 1.4em;
  }
  :global(.sveltecms) :global(.entitylist)>:global(div:nth-child(2))>:global(div.field)>:global(label)>:global(span) {
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
  }</style>