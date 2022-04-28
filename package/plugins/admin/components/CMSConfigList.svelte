<script>import { get } from 'lodash-es';
import CmsFieldCollection from "sveltecms/CMSFieldCollection.svelte";
export let cms;
export let adminPath;
let addItem, addItemLink;
let isCustom = {};
$: fieldCollection = cms.adminFieldCollections[adminPath.fieldCollection] || {};
$: items = Object.entries(get(cms.conf, adminPath.configPath, {}));
</script>

<form>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        {#if fieldCollection['allowString']}
          <th>Custom</th>
        {/if}
        <th>Detail</th>
      </tr>
    </thead>
      <tbody>
        {#each items as [id, item], i}
          <tr>
            <td><input type="text" bind:value={id}></td>

            {#if fieldCollection['allowString']}
              <td><input type="checkbox" bind:checked={isCustom[id]}></td>
            {/if}

            <td>
              {#if typeof item === 'string'}
                <select bind:value={item}>
                </select>
              {:else}
                <select bind:value={item['type']}>
                </select>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
  </table>
</form>

<form on:submit={()=>{addItemLink.click()}}>
  <input type="text" bind:value={addItem} />
  <a href="{adminPath}/{addItem}" bind:this={addItemLink}>Add</a>
</form>
