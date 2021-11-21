<script lang="ts">

import type { SvelteCMSContentField } from "..";

  export let field:SvelteCMSContentField
  export let id:string

  // For multiple collections, it is necessary to set the value to {}, otherwise SSR causes infinite loop
  export let value = [field.fields ? {} : field.default]

</script>

<fieldset class="cms-multiple" on:click|preventDefault>
  <label for="{id}[0]">{field.title}<label>
  {#each value as v,i}
  <div class="cms-multiple-item">
    <button class="cms-multiple-item-delete" aria-label="Remove {field.title} item" on:click={(e) => { debugger; value.splice(i,1); value=value; }}>✖️</button>
    <svelte:component
      this={field.widget.widget}
      bind:value={v}
      {field}
      id="{id}[{i}]"
    />
  </div>
{/each}
<button class="cms-multiple-item-add" aria-label="Add {field.title} item" on:click|preventDefault={() => { value = [...value, field.default]}}>+ add {field.title.toLowerCase()} item</button>

</fieldset>
