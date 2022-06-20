<script>import { onMount, tick } from "svelte";
import CmsWidgetFieldgroup from "./CMSWidgetFieldgroup.svelte";
import Button from "sveltecms/ui/Button.svelte";
import { cloneDeep } from "lodash-es";
export let field;
export let id;
export let cms;
// For multiple fieldgroups, it is necessary to set the value to {}, otherwise SSR causes infinite loop
export let value = [field.type === 'fieldgroup' ? {} : field.default];
if (!Array.isArray(value) && !field?.multipleOrSingle)
    value = [value];
let fieldgroupsCollapsed = [];
// We defer this so that child widgets can measure their height, e.g. for autosizing textareas
onMount(() => { fieldgroupsCollapsed = Array.isArray(value) ? value?.map(i => true) : [true]; });
let formItems = {};
async function addItem() {
    if (!Array.isArray(value))
        value = [value];
    if (value.length === 0 && field?.multipleOrSingle)
        value = cloneDeep(field.default);
    else
        value = [...value, cloneDeep(field.default)];
    await tick();
    formItems[value.length - 1].getElementsByTagName('label')[0].focus();
}
async function removeItem(i) {
    if (!Array.isArray(value))
        value = [];
    else {
        value.splice(i, 1);
        if (value.length === 1 && field?.multipleOrSingle)
            value = value[0];
        else
            value = value;
    }
}
</script>

<fieldset class="multiple" on:click|preventDefault>

  <legend>{field.label}</legend>

  {#if Array.isArray(value)}
    {#each value as v,i}
      <div class="multiple-item" bind:this={formItems[i]}>
        {#if field.widget.type === 'fieldgroup'}
          <CmsWidgetFieldgroup
            {field}
            id="{id}[{i}]"
            bind:value={v}
            {cms}
            bind:collapsed={fieldgroupsCollapsed[i]}
          />
        {:else}
          <svelte:component
            this={field.widget.widget}
            {field}
            id="{id}[{i}]"
            bind:value={v}
            {cms}
          />
        {/if}
        <div class="delete">
          <Button cancel
            helptext="Remove {field.label} item"
            on:click={removeItem}>&times;</Button>
        </div>
      </div>
    {/each}
  {:else}
    <div class="multiple-item single" bind:this={formItems[0]}>
      {#if field.widget.type === 'fieldgroup'}
        <CmsWidgetFieldgroup
          {field}
          id="{id}"
          bind:value
          {cms}
          bind:collapsed={fieldgroupsCollapsed[0]}
        />
      {:else}
        <svelte:component
          this={field.widget.widget}
          {field}
          id="{id}"
          bind:value
          {cms}
        />
      {/if}
      <div class="delete">
        <Button cancel
          helptext="Remove {field.label} item"
          on:click={removeItem}>&times;</Button>
      </div>
    </div>
  {/if}
  <Button small helptext="Add {field.label} item" on:click={addItem}>+ add {field.label.toLowerCase()} item</Button>

</fieldset>

<style global>
  :global(.sveltecms) :global(.multiple-item) { position:relative; }
  :global(.sveltecms) :global(.multiple-item)>:global(.delete) { position:absolute; top:.25em; right:.5em; }
</style>