<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { FieldableEntity } from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";

import Field from 'sveltecms/display/Field.svelte'
import Wrapper from "./Wrapper.svelte";

  export let cms:SvelteCMS
  export let entity:FieldableEntity = undefined
  export let item:Content

  $: fields = Object.entries(entity?.fields || {})

</script>

{#each fields as [id, field]}
  {#if typeof item?.[id] !== 'undefined' && (!Array.isArray(item[id]) || item[id]?.['length'])}

    {#if field?.display?.wrapper}

      <Wrapper display={field.display.wrapper}>
        <Field
          {cms}
          item={item[id]}
          entity={field}/>
      </Wrapper>

    {:else if field?.display}

      <Field
        {cms}
        item={item[id]}
        entity={field}/>

    {/if}

  {/if}
{/each}
