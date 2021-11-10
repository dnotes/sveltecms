<script lang="ts">
import type { SvelteCMSContentField } from "..";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = [field.default]

  function addValue() { value = [...value, field.default] }

</script>

<fieldset>

{#each value as v,i}
  <div>
    <svelte:component
      this={field.widget.widget}
      bind:value={v}
      {field}
      id="{id}[{i}]"
    />
  </div>
  <button on:click={() => { value = value.splice(i,1); value=value; }}>x</button>
{/each}
<button on:click|preventDefault={addValue}>+ new</button>

</fieldset>
