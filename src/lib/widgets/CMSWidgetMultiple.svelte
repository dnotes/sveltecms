<script lang="ts">
import { tick } from "svelte";
import CmsWidgetCollection from "./CMSWidgetCollection.svelte";
import type { WidgetField } from "..";
import type SvelteCMS from "..";
import Button from "sveltecms/ui/Button.svelte";
import { cloneDeep } from "lodash-es";

  export let field:WidgetField
  export let id:string

  export let cms:SvelteCMS

  // For multiple collections, it is necessary to set the value to {}, otherwise SSR causes infinite loop
  export let value = [field.fields ? {} : field.default]

  let formItems:{[key:number]:HTMLElement} = {}

  async function addItem() {
    value = [...value, cloneDeep(field.default)]
    await tick()
    formItems[value.length-1].getElementsByTagName('label')[0].focus()
  }

</script>

<fieldset class="cms-multiple" on:click|preventDefault>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label for="{id}[0]"><span>{field.label}</span></label>
  {#each value as v,i}
    <div class="cms-multiple-item" bind:this={formItems[i]}>
      {#if field.widget.type === 'collection'}
        <svelte:component
          this={CmsWidgetCollection}
          {field}
          id="{id}[{i}]"
          bind:value={v}
          {cms}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id="{id}[{i}]"
          bind:value={v}
        />
      {/if}
      <div class="close">
        <Button cancel
          helptext="Remove {field.label} item"
          on:click={(e) => { value.splice(i,1); value=value; }}>&times;</Button>
      </div>
    </div>
  {/each}
  <Button small helptext="Add {field.label} item" on:click={addItem}>+ add {field.label.toLowerCase()} item</Button>

</fieldset>

<style>
  div.cms-multiple-item { position:relative; }
  div.close { position:absolute; top:5px; right:5px; }
</style>