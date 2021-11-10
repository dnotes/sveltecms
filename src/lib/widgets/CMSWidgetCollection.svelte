<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import type { SvelteCMSContentField } from '$lib';

  let parentField:SvelteCMSContentField
  let parentID = ''
  export { parentField as field, parentID as id }

  export let value = {}
  export let errors = {}

</script>

<fieldset class="collection">
  {#each Object.entries(parentField.fields) as [id,field]}

  <div class="field">
    {#if !field.widget.widget}
      <CmsWidgetUndefined {field} id="{parentID}[{id}]" />
    {:else if field.multiple && !field.widget.handlesMultiple}
      <CmsWidgetMultiple
        {field}
        id="{parentID}[{id}]"
        bind:value={value[id]}
      />
    {:else}
      <svelte:component
        this={field.widget.widget}
        {field}
        id="{parentID}[{id}]"
        bind:value={value[id]}
        bind:errors={errors[id]}
      />
    {/if}
  </div>

  {/each}

</fieldset>
