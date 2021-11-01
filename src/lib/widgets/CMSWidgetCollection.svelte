<script lang="ts">
import CmsWidgetUndefined from './CMSWidgetUndefined.svelte';
import type { SvelteCMSContentFieldConfig } from '$lib';

  export let conf:SvelteCMSContentFieldConfig
  export let contentType:string

  let parentID = ''
  export { parentID as id }
  // export let disabled=(conf?.disabled ? true : false)
  // export let required=(conf?.required ? true : false)

  export let value = {}

</script>

<fieldset class="SvelteCMSEditorFieldset">
  {#each Object.entries(conf.fields) as [id,f]}

    <div class="SvelteCMSEditorField">
      {#await f.widget}
        loading...
      {:then component}
        <svelte:component
          this={component}
          bind:value={value[id]}
          conf={f}
          id="{parentID}[{id}]"
          />
      {:catch error}
        <CmsWidgetUndefined conf={f} {contentType} {id} />
      {/await}
    </div>

  {/each}

</fieldset>
