<script lang="ts">
import SvelteCMSConfig from './index';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import type { SvelteCMSConfigSetting } from './global';
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';

  export let conf:SvelteCMSConfigSetting = undefined
  export let contentType:string

  let cms = new SvelteCMSConfig(conf)

  let t = cms.types[contentType]

  export let values = {}

  export let initialValues = undefined
  let pageTitle = `New ${t.title}`
  if (initialValues) {
    values = {...initialValues}
    pageTitle = `Edit ${t.title}`
  }

</script>

<div class="SvelteCMSEditorForm">
  <h2>
    {#if initialValues}
      Edit
    {:else}
      New
    {/if}
    {t?.title}
  </h2>

  <form class="SvelteCMSEditor">
    {#each Object.entries(t.fields) as [id,f]}

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
              bind:value={values[id]}
              {component}
              conf={f}
              {id}
            />

          {:else}

            <svelte:component
              this={component}
              bind:value={values[id]}
              conf={f}
              {id}
            />
          {/if}
        {:catch error}
          <CmsWidgetUndefined conf={f} {contentType} {id} />
        {/await}
      </div>

    {:else}
      nothing to edit.
    {/each}

  </form>
</div>
