<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import CmsWidgetMultiple from './CMSWidgetMultiple.svelte';
import type { SvelteCMSContentField } from '$lib';

  export let conf:SvelteCMSContentField
  export let contentType:string

  let parentID = ''
  export { parentID as id }
  // export let disabled=(conf?.disabled ? true : false)
  // export let required=(conf?.required ? true : false)

  export let value = {}

</script>

<fieldset class="collection">
  {#each Object.entries(conf.fields) as [id,f]}

    <div
      class="field"
      class:multiple="{f.multiple}"
      class:disabled="{f.disabled}"
      class:required="{f.required}"
    >
      {#await f.widget}
        loading...
      {:then component}
        {#if f.multiple}

          <CmsWidgetMultiple
            bind:value={value[id]}
            {component}
            conf={f}
            id="{parentID}[{id}]"
          />

        {:else}

          <svelte:component
            this={component}
            bind:value={value[id]}
            conf={f}
            id="{parentID}[{id}]"
          />
        {/if}
      {:catch error}
        <CmsWidgetUndefined conf={f} {contentType} {id} />
      {/await}
    </div>

  {/each}

</fieldset>
