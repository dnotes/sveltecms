<script>export let cms;
export let items;
let addField, addFieldLink;
let isCustom = {};
$: fieldList = cms.getFieldTypes();
$: console.log(fieldList);
function toggleCustom(i) {
    let [id, item] = items[i];
    item = (typeof item === 'string') ? { type: item } : item['type'];
    isCustom[id] = typeof item !== 'string';
}
</script>

<ul>
  {#each items as [id, item], i}
  <li>
    <div>
      <input type="text" bind:value={id}>
      {#if typeof item === 'string'}
        <select bind:value={item}>
          {#each fieldList as fieldID}
            <option value={fieldID}>{fieldID}</option>
          {/each}
        </select>
      {:else}
        <select bind:value={item.type}>
          {#each fieldList as fieldID}
            <option value={fieldID}>{fieldID}</option>
          {/each}
        </select>
      {/if}

      <label>
        <input type="checkbox" bind:checked={isCustom[id]} on:click="{()=>{toggleCustom(i)}}">
      </label>
    </div>

  </li>
  {/each}
</ul>

