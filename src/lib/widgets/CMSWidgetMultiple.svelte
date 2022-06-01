<script lang="ts">
import { onMount, tick } from "svelte";
import CmsWidgetFieldgroup from "./CMSWidgetFieldgroup.svelte";
import type { WidgetField } from "..";
import type SvelteCMS from "..";
import Button from "sveltecms/ui/Button.svelte";
import { cloneDeep } from "lodash-es";

  export let field:WidgetField
  export let id:string

  export let cms:SvelteCMS

  // For multiple fieldgroups, it is necessary to set the value to {}, otherwise SSR causes infinite loop
  export let value = [field.type === 'fieldgroup' ? {} : field.default]

  let fieldgroupsCollapsed = []
  // We defer this so that child widgets can measure their height, e.g. for autosizing textareas
  onMount(()=>{ fieldgroupsCollapsed = value.map(i=>true)})

  let formItems:{[key:number]:HTMLElement} = {}

  async function addItem() {
    value = [...value, cloneDeep(field.default)]
    await tick()
    formItems[value.length-1].getElementsByTagName('label')[0].focus()
  }

</script>

<fieldset class="cms-multiple" on:click|preventDefault>

  <legend>{field.label}</legend>

  {#each value as v,i}
    <div class="cms-multiple-item" bind:this={formItems[i]}>
      {#if field.widget.type === 'fieldgroup'}
        <svelte:component
          this={CmsWidgetFieldgroup}
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
        />
      {/if}
      <div class="delete">
        <Button cancel
          helptext="Remove {field.label} item"
          on:click={(e) => { value.splice(i,1); value=value; }}>&times;</Button>
      </div>
    </div>
  {/each}
  <Button small helptext="Add {field.label} item" on:click={addItem}>+ add {field.label.toLowerCase()} item</Button>

</fieldset>

<style global>
  .sveltecms .cms-multiple-item { position:relative; }
  .sveltecms .cms-multiple-item>.delete { position:absolute; top:.5em; right:.5em; }
</style>