<script lang="ts">
import type { AdminPage } from 'sveltecms/core/AdminPage';
import type SvelteCMS from 'sveltecms';
import CmsConfigurableEntity from './CMSConfigurableEntity.svelte';
import { get, set, isEqual, values } from 'lodash-es'
import { tick } from 'svelte';

  export let cms:SvelteCMS
  export let options:{
    configPath:string,
    allowString:boolean,
    collection:string,
  }

  let addID, addType, addIDEl
  let focuses = {}

  let items = Object.entries(get(cms.conf, options.configPath, {}))
  $: defaultItems = Object.keys(cms[options.configPath]).filter(id => !items.find(item => item[0] === id))

  $: oldConf = get(cms.conf, options.configPath, {})
  $: newConf = Object.fromEntries(items)

  $: unsaved = !isEqual(oldConf, newConf) || !isEqual(Object.keys(oldConf), Object.keys(newConf))

  let entities = cms.listEntities(options.configPath)

  $: isDefault = Object.fromEntries(items.map(([id,item]) => {
    return [id, typeof item === 'string']
  }));
  let isCollapsed = {}

  async function toggleCustom(id) {
    let i = items.findIndex(entry => entry[0] === id)
    items[i][1] = typeof items[i][1] === 'string' ? { type: items[i][1] } : items[i][1]['type']
  }

  async function addItem() {
    if (addID && addType) {
      items.push([addID, (options.allowString ? addType : { type:addType })])
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
    set(cms.conf, options.configPath, Object.fromEntries(items))
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
        <th></th>
        <th>ID</th>
        <th>Type</th>
        <th>Default</th>
        <th>Ops</th>
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
              {#if !isDefault[id]}
                <button type="button" on:click|preventDefault={()=>{isCollapsed[id] = !isCollapsed?.[id]}}>
                  {#if isCollapsed[id]}&dtri{:else}&utri;{/if}
                </button>
              {/if}
            </td>
            <td>
              <button type="button" on:click|preventDefault={()=>{removeItem(id)}}>✖️</button>
            </td>
          </tr>
          <tr style:display={(isDefault[id] || isCollapsed[id]) ? 'none' : 'table-row'}>
            <td><span style:display="none"></span></td>
            <td colspan="4">
              <CmsConfigurableEntity {cms} bind:data={item} options={{type:options.configPath, id}} />
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
            <input type="checkbox" checked={options.allowString} on:focus={addItem}>
          </td>
          <td>
            <button type="button" disabled={!addID || !addType} on:click={addItem}>+</button>
          </td>
        </tr>
      </tbody>
  </table>
  <button type="submit" disabled={!unsaved}>Save</button>
</form>
