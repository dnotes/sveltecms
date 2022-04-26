<script lang="ts">
import type SvelteCMS from "../..";

  export let cms:SvelteCMS
  export let adminPath:string

  let addItem, addItemLink

  $: [key] = adminPath.split('/')
  $: items = Object.entries(cms[key])

</script>

<ul>
  {#each items as [id, item]}
    {id}
  {:else}
    No items found.
  {/each}
</ul>

<form on:submit={()=>{addItemLink.click()}}>
  <input type="text" bind:value={addItem} />
  <a href="{adminPath}/{addItem}" bind:this={addItemLink}>Add</a>
</form>
