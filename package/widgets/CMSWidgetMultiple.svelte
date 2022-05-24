<script>import { tick } from "svelte";
import CmsWidgetCollection from "./CMSWidgetCollection.svelte";
import Button from "sveltecms/ui/Button.svelte";
export let field;
export let id;
export let cms;
// For multiple collections, it is necessary to set the value to {}, otherwise SSR causes infinite loop
export let value = [field.fields ? {} : field.default];
let formItems = {};
async function addItem() {
    value = [...value, field.default];
    await tick();
    formItems[value.length - 1].getElementsByTagName('label')[0].focus();
}
</script>

<fieldset class="cms-multiple" on:click|preventDefault>
  <!-- svelte-ignore a11y-label-has-associated-control -->
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
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id={`${id}[${i}]`}
          bind:value={v}
        />
      {/if}
      <Button small helptext="Remove {field.label} item" on:click={(e) => {
        value.splice(i,1); value=value;
      }}>✖️</Button>
    </div>
  {/each}
<Button small helptext="Add {field.label} item" on:click={addItem}>+ add {field.label.toLowerCase()} item</Button>

</fieldset>
