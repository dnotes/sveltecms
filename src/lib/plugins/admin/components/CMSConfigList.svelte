<script lang="ts">
import type { AdminPage } from 'sveltecms/plugins/admin';
import type SvelteCMS from 'sveltecms';
import CmsFieldCollection from 'sveltecms/CMSFieldCollection.svelte';
import CmsField from 'sveltecms/CMSField.svelte';
import { get, set, isEqual } from 'lodash-es'
import { tick } from 'svelte';

  export let cms:SvelteCMS
  export let adminPage:AdminPage

  let addID, addType, addIDEl
  let focuses = {}

  let items = Object.entries(get(cms.conf, adminPage.configPath, {}))
  $: oldConf = get(cms.conf, adminPage.configPath, {})
  $: newConf = Object.fromEntries(items)

  // @ts-ignore
  let opts:{ collection:string, allowString:boolean, stringField:string } = adminPage.options

  $: collection = cms.adminCollections[opts.collection]

  $: unsaved = !isEqual(oldConf, newConf) || !isEqual(Object.keys(oldConf), Object.keys(newConf))

  $: isDefault = Object.fromEntries(items.map(([id,item]) => {
    return [id, typeof item === 'string']
  }));

  $: console.log()

  async function toggleCustom(id) {
    let i = items.findIndex(entry => entry[0] === id)
    items[i][1] = typeof items[i][1] === 'string' ? { type: items[i][1] } : items[i][1]['type']
  }

  async function addItem() {
    if (addID && addType) {
      items.push([addID, (opts.allowString ? addType : { type:addType })])
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

  export let saveConfig = async () => {
    set(cms.conf, adminPage.configPath, Object.fromEntries(items))
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
                  {#each cms.getConfigTypes(adminPage.configPath) as type}
                     <option value={type}>{type}</option>
                  {/each}
                </select>
              {:else}
                <select bind:value={item['type']}>
                  {#each cms.getConfigTypes(adminPage.configPath) as type}
                      <option value={type}>{type}</option>
                  {/each}
                </select>
              {/if}
            </td>
            <td>
              {#if opts.allowString}
                <input type="checkbox"
                  bind:checked={isDefault[id]}
                  bind:this={focuses[id]}
                  on:click={()=>{toggleCustom(id)}}>
              {:else}
                <input type="checkbox" disabled />
              {/if}
            </td>
            <td>
              <button type="button" on:click|preventDefault={()=>{removeItem(id)}}>✖️</button>
            </td>
          </tr>
        {/each}
        <!-- Add item -->
        <tr>
          <td><input id="new-item" type="text" bind:value={addID} bind:this={addIDEl}></td>
          <td>
            <select bind:value={addType}>
              {#each cms.getConfigTypes(adminPage.configPath) as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </td>
          <td>
            <input type="checkbox" checked={opts.allowString} on:focus={addItem}>
          </td>
          <td>
            <button type="button" disabled={!addID || !addType} on:click={addItem}>+</button>
          </td>
        </tr>
      </tbody>
  </table>
  <button type="submit" disabled={!unsaved}>Save</button>
</form>
