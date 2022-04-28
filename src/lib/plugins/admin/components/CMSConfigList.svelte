<script lang="ts">
import type { AdminPath } from 'sveltecms/plugins/admin';
import type SvelteCMS from 'sveltecms';
import { get } from 'lodash-es'
import { tick } from 'svelte';

  export let cms:SvelteCMS
  export let adminPath:AdminPath

  let addID, addType, addIDEl
  let focuses = {}

  $: fieldCollection = cms.adminCollections[adminPath.fieldCollection]
  $: allowString = fieldCollection?.allowString
  $: conf = get(cms.conf, adminPath.configPath, {})
  $: items = Object.entries(conf)
  $: isDefault = Object.fromEntries(items.map(([id,item]) => {
    return [id, typeof item === 'string']
  }));

  async function toggleCustom(id) {
    conf[id] = typeof conf[id] === 'string' ? { type: conf[id] } : conf[id].type
    conf = conf
  }

  async function addItem() {
    if (addID && addType) {
      conf[addID] = fieldCollection?.allowString ? addType : { type:addType }
      await tick()
      focuses[addID].focus()
      addID = ''
      addType = ''
    }
  }

  function removeItem(id) {
    delete conf[id]
    conf = conf
    addIDEl.focus()
  }

  export let saveConfig = async () => {
    let res = await fetch('/admin/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cms.conf),
    })
    console.log(res)
  }

</script>

<form method="post" enctype="multipart/form-data" on:submit|preventDefault={saveConfig}>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Default</th>
        <th>Ops</th>
      </tr>
    </thead>
      <tbody>
        {#each items as [id, item], i}
          <tr>
            <td><input type="text" bind:value={id}></td>
            <td>
              {#if typeof item === 'string'}
                <select bind:value={item}>
                  {#each cms.getFieldTypes() as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              {:else}
                <select bind:value={item['type']}>
                  {#each cms.getFieldTypes() as type}
                    <option value={type}>{type}</option>
                  {/each}
                </select>
              {/if}
            </td>
            <td>
              {#if fieldCollection?.allowString}
                <input type="checkbox"
                  bind:checked={isDefault[id]}
                  bind:this={focuses[id]}
                  on:click={()=>{toggleCustom(id)}}>
              {:else}
                <input type="checkbox" checked disabled />
              {/if}
            </td>
            <td>
              <button type='button' on:click|preventDefault={()=>{removeItem(id)}}>✖️</button>
            </td>
          </tr>
        {/each}
        <!-- Add item -->
        <tr>
          <td><input id="new-item" type="text" bind:value={addID} bind:this={addIDEl}></td>
          <td>
            <select bind:value={addType}>
              {#each cms.getFieldTypes() as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </td>
          <td>
            <input type="checkbox" checked={allowString} on:focus={addItem}>
          </td>
          <td>
          </td>
        </tr>
      </tbody>
  </table>
  <button type="submit">Save</button>
</form>
