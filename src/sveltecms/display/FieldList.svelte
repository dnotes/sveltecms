<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { FieldableEntity } from "sveltecms";
import type { Value } from "sveltecms/core/ContentStore";
import Display from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";

import FieldValue from "./FieldValue.svelte";
import Wrapper from "./Wrapper.svelte";

export let cms:SvelteCMS
export let entity:FieldableEntity
export let item:{[key:string]:Value}
export let displayMode:string

let fieldlist:[string,Field][]
let displays:{[id:string]:Display}

$: fieldlist = Object.entries(entity?.fields || {})
$: displays = Object.fromEntries(fieldlist.map(([id,field]) => ([id, new Display(field?.displays?.[displayMode] ?? field?.displays?.['default'], cms)])))

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
