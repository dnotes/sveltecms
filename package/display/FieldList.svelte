<script>import Display from "sveltecms/core/Display";
import FieldValue from "./FieldValue.svelte";
import Wrapper from "./Wrapper.svelte";
export let cms;
export let entity;
export let item;
export let displayMode;
let fieldlist;
let displays;
$: fieldlist = Object.entries(entity?.fields || {});
$: displays = Object.fromEntries(fieldlist.map(([id, field]) => ([id, new Display(field?.displayModes?.[displayMode] ?? field?.display, cms)])));
</script>

{#each fieldlist as [id, field]}
  {#if typeof item?.[id] !== 'undefined' && (!Array.isArray(item[id]) || item[id]?.['length'])}

    {#if displays[id]?.wrapper?.isDisplayed}

      <Wrapper
        {cms}
        entity={field}
        item={item[id]}
        parent={item}
        {displayMode}
        display={displays[id].wrapper}
        class="field-{entity?.['id']} field-type-{field?.['type']}"
      >
        <FieldValue
          {cms}
          entity={field}
          item={item[id]}
          parent={item}
          {displayMode}
        />
      </Wrapper>

    {:else if displays[id]?.isDisplayed}

      <FieldValue
        {cms}
        entity={field}
        item={item[id]}
        parent={item}
        {displayMode}
      />

    {/if}

  {/if}
{/each}
