<script lang="ts">
import CmsField from 'sveltecms/CMSField.svelte';
import type SvelteCMS from 'sveltecms';
import type { FieldableEntity } from 'sveltecms';
import { onMount, onDestroy } from 'svelte'

export let cms:SvelteCMS

export let values = {}
export let errors = {}
export let touched = {}

export let id:string = undefined

// One of the below is required; widgetFieldCollection overrides collection
export let collection:FieldableEntity
export let widgetFieldCollection = cms.getWidgetFields(collection, { values, errors, touched, id })

  let root:HTMLElement


  onMount(() => {
    widgetFieldCollection.eventListeners?.forEach(conf => {
      root.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.addEventListener(conf.on, (event) => {
        // TODO: Why are event and el not available when the function is executed?
        conf.function.fn(conf.function.vars, conf.function.options, event, el)
      }))
    })
  })
  onDestroy(() => {
    widgetFieldCollection.eventListeners?.forEach(conf => {
      root?.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.removeEventListener(conf.on, (event) => {
        conf.function.fn(conf.function.vars, conf.function.options, event, el)
      }))
    })
  })

  // This is necessary for conditional/computed fields
  $: if (values || errors || touched) widgetFieldCollection = widgetFieldCollection

</script>

<div bind:this={root}>
  {#each Object.keys(values) as id}
    {#if !widgetFieldCollection.fields[id]}
      <input type="hidden" name={id} bind:value={values[id]} />
    {/if}
  {/each}
  {#each Object.entries(widgetFieldCollection.fields) as [id,field]}
    <CmsField {field} {id} bind:value={values[id]} {cms} />
  {:else}
    There are no fields to edit.
  {/each}
</div>
