<script lang="ts">
import type { SvelteCMSContentField } from "..";

  export let conf:SvelteCMSContentField
  export let id:string
  export let component

  export let value = [conf.default]

  function addValue() { value = [...value, conf.default] }
</script>

<fieldset>

{#each value as v,i}
  <div>
    <svelte:component
      this={component}
      bind:value={v}
      {conf}
      id="{id}[{i}]"
    />
  </div>
  <button on:click={() => { value = value.splice(i,1); value=value; }}>x</button>
{/each}
<button on:click|preventDefault={addValue}>+ new</button>

</fieldset>
