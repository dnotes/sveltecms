<script lang="ts">
import type { AdminPage } from 'sveltecms/core/AdminPage';
import type SvelteCMS from 'sveltecms';
import CmsConfigurableEntity from './CMSConfigurableEntity.svelte';
import { get, set, isEqual, values } from 'lodash-es'
import { tick } from 'svelte';
import Modal from 'sveltecms/components/Modal.svelte';
import type { ConfigurableEntityConfigSetting } from 'sveltecms';

  export let cms:SvelteCMS
  export let options:{
    configPath?:string,
  } = {}
  let opts = Object.assign({}, options)

  const headings = {
    ID: `The machine name for each of the ${opts.configPath}.`,
    Type: `The parent type for each entity configuration.`,
    Config: `The type-specific config that will be saved.`,
    Operations: `Edit or delete ${opts.configPath}`,
  }

  // All config items for the type of entities being configured, as an array
  let items = Object.entries(get(cms.conf, options.configPath, {}))

  // All entities of the type being configured
  let entities = cms.listEntities(options.configPath)

  // Variables for the elements where new lines are added
  let addID, addType, addIDEl
  let focuses = {}

  // A variable for an the entity configuration Modal
  let collection

  // A list of items that are not configured at all
  $: defaultItems = entities.filter(id => !items.find(item => item[0] === id))

  $: isDefault = Object.fromEntries(items.map(([id,item]) => {
    return [id, typeof item === 'string']
  }));

  async function toggleCustom(id) {
    let i = items.findIndex(entry => entry[0] === id)
    items[i][1] = typeof items[i][1] === 'string' ? { type: items[i][1] } : items[i][1]['type']
  }

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

  function removeItem(id) {
    let i = items.findIndex(entry => entry[0] === id)
    items.splice(i, 1)
    items = items
    addIDEl.focus()
  }

</script>

  <table>
    <thead>
      <tr>

      </tr>
    </thead>
      <tbody>
        {#each defaultItems as id}
          <tr>
            <td></td>
            <td>{id}</td>
            <td></td>
            <td>
              <input type="checkbox" checked on:change={()=>{
                items = [[id,{ type:id }], ...items]
              }}>
            </td>
            <td></td>
          </tr>
        {/each}
        {#each items as [id, item]}
          <tr>
            <td class="reorder">&updownarrow;</td>
            <td><input type="text" bind:value={id} disabled={!item['type'] || item['type'] === item['id']}></td>
            <td>
              {#if typeof item === 'string'}
                <select bind:value={item}>
                  {#each entities as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              {:else if id === item['type']}
                &nbsp;
              {:else}
                <select bind:value={item['type']}>
                  {#each entities as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              {/if}
            </td>
            <td>
              <input type="checkbox"
                bind:checked={isDefault[id]}
                bind:this={focuses[id]}
                on:change={()=>{toggleCustom(id)}}
              >
            </td>
            <td>
              <button type="button" on:click|preventDefault={()=>{removeItem(id)}}>✖️</button>
            </td>
          </tr>
        {/each}
        <!-- Add item -->
        <tr>
          <td></td>
          <td><input id="new-item" type="text" bind:value={addID} bind:this={addIDEl}></td>
          <td>
            <select bind:value={addType}>
              {#each cms.listEntities(options.configPath) as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </td>
          <td>
          </td>
          <td>
            <button type="button" disabled={!addID || !addType} on:click={addItem}>+</button>
          </td>
        </tr>
      </tbody>
  </table>

{#if collection}
  <Modal on:cancel={()=>{ collection = undefined }}>

    <button
      type="button"
      class="primary"
      on:click={()=>{ collection = undefined }}
    >Close</button>

  </Modal>
{/if}
