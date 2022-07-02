<script>import Button from 'sveltecms/ui/Button.svelte';
import Modal from 'sveltecms/ui/Modal.svelte';
import CmsWidgetConfigurableEntity from 'sveltecms/plugins/admin/widgets/CMSWidgetConfigurableEntity.svelte';
import { tick } from 'svelte';
import yaml from 'js-yaml';
import AddItemLine from 'sveltecms/ui/AddItemLine.svelte';
export let cms;
export let data;
export let options;
let opts = Object.assign({}, options);
const headings = {
    ID: `The machine name for the entity configuration.`,
    Type: `The parent type for the entity configuration.`,
    Config: `The type-specific config that will be saved.`,
    Operations: `Edit, delete, or reset configurations`,
};
// All config items for the type of entities being configured, as an array
let items = Object.entries(data);
// All entities of the type being configured
let entities = cms.listEntities(opts.configPath);
// Variables for the elements where new lines are added
let addID, addType, addIDEl;
let focuses = {};
// A list of items that are not configured at all
$: defaultItems = entities.filter(id => !items.find(item => item[0] === id)).map(k => [k, undefined]);
async function addItem() {
    if (addID && addType) {
        items.push([addID, addType]);
        items = items;
        await tick();
        focuses[addID]?.focus();
        addID = '';
        addType = '';
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
function resetItem(i) {
    items[i][1] = items[i][0];
}
function customizeDefaultItem(id, value) {
    if (value)
        items = [...items, [id, value]];
}
$: data = Object.fromEntries(items);
</script>

<table>
  <thead>
    <tr>
      {#each Object.entries(headings) as [text, title]}
        <th {title} class={text.includes('.') ? 'center' : 'left'}>{text === 'Order' ? '' : text}</th>
      {/each}
    </tr>
  </thead>
    <tbody>
      {#each items as [id, value], i}
        <tr>
          <td><input type="text" bind:value={id} disabled={!value['type'] || value['type'] === value['id']}></td>
          <td>
            <CmsWidgetConfigurableEntity
              {cms}
              type={opts.configType}
              {id}
              disabled={!value['type'] || value['type'] === id}
              items={entities}
              bind:value
            />
          </td>
          <td>
            <pre><code>{yaml.dump(value)}</code></pre>
          </td>
          <td>
            <Button small on:click={()=>{confirmRemove=i}}>X</Button>
            {#if typeof value !== 'string'}
              <Button small on:click={()=>{resetItem(i)}}>Reset</Button>
            {/if}
          </td>
        </tr>
      {/each}
      {#each defaultItems as [id, value]}
        <tr>
          <td>{id}</td>
          <td>
            <CmsWidgetConfigurableEntity
              {cms}
              type={opts.configType}
              {id}
              items={entities}
              forceEntityID={id}
              unset="- default -"
              disabled
              bind:value
              on:change={(e)=>{customizeDefaultItem(id,e?.detail?.value)}}
            />
          </td>
          <td><em class="disabled">- default -</em></td>
          <td></td>
        </tr>
      {/each}
    </tbody>
</table>

<AddItemLine>
  <input id="new-item" type="text" bind:value={addID} bind:this={addIDEl}>
  <select bind:value={addType}>
    {#each cms.listEntities(opts.configPath) as type}
      <option value={type}>{type}</option>
    {/each}
  </select>
  <Button primary disabled={!addID || !addType} on:click={addItem}>+ add</Button>
</AddItemLine>

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

<style>
  td { vertical-align:top; }
  pre { margin:0; }</style>