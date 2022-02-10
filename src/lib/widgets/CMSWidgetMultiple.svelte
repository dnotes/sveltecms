<script lang="ts">
import { tick } from "svelte";
import CmsWidgetCollection from "./CMSWidgetCollection.svelte";
import type { SvelteCMSContentField } from "..";
import type SvelteCMS from "..";

  export let field:SvelteCMSContentField
  export let id:string

  export let cms:SvelteCMS
  export let contentTypeID:string

  // For multiple collections, it is necessary to set the value to {}, otherwise SSR causes infinite loop
  export let value = [field.fields ? {} : field.default]

  let formItems:{[key:number]:HTMLElement} = {}

  async function addItem() {
    value = [...value, field.default]
    await tick()
    formItems[value.length-1].getElementsByTagName('label')[0].focus()
  }

</script>

<fieldset class="cms-multiple" on:click|preventDefault>
  <label for="{id}[0]">{field.label}<label>
  {#each value as v,i}
    <div class="cms-multiple-item" bind:this={formItems[i]}>
      {#if field.widget.type === 'collection'}
        <svelte:component
          this={CmsWidgetCollection}
          {field}
          id={`${id}[${i}]`}
          bind:value={v}
          {cms}
          {contentTypeID}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id={`${id}[${i}]`}
          bind:value={v}
        />
      {/if}
      <button type="button" class="cms-multiple-item-delete" aria-label="Remove {field.label} item" on:click|preventDefault={(e) => {
        value.splice(i,1); value=value;
      }}>✖️</button>
    </div>
  {/each}
<button type="button" class="cms-multiple-item-add" aria-label="Add {field.label} item" on:click|preventDefault={addItem}>+ add {field.label.toLowerCase()} item</button>

</fieldset>
