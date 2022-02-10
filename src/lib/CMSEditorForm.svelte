<script lang="ts">
import type SvelteCMS from './index';
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetCollection from './widgets/CMSWidgetCollection.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import DisplayResult from './components/DisplayResult.svelte'
import { cloneDeep } from 'lodash-es'
import { onDestroy, onMount } from 'svelte';

  export let cms:SvelteCMS
  export let contentTypeID:string
  export let previewComponent = undefined

  export let result
  export let values = {}
  export let errors = {}
  export let touched = {}
  export let disabled = false
  export let submitOptions = {}

  export let contentType = undefined // in case someone wants to log / debug

  contentType = cms.getContentType(contentTypeID)
  let collection = cms.getWidgetFields(contentType, { values, errors, touched })

  const initialValues = cloneDeep(values)

  // export let validator:Validator.Validator<Object> = cms.getValidator(contentTypeID, values)

  // $: if (values) {
  //   disabled = validator.fails()
  //   errors = validator.errors.all()
  // }

  export let submit = async (event)=>{
    event.preventDefault()
    try {
      let res = await cms.saveContent(contentTypeID, values, submitOptions)
      result = { ...(res || {}), ok:true }
    }
    catch(e) {
      console.error(e)
      result = e
    }
  }

  let form:HTMLElement
  onMount(() => {
    collection.eventListeners?.forEach(conf => {
      form.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.addEventListener(conf.on, (event) => {
        // TODO: Why are event and el not available when the function is executed?
        conf.function.fn(conf.function.vars, conf.function.options, event, el)
      }))
    })
  })
  onDestroy(() => {
    collection.eventListeners?.forEach(conf => {
      form.querySelectorAll(`[name="${conf.id}"]`).forEach(el => el.removeEventListener(conf.on, (event) => {
        conf.function.fn(conf.function.vars, conf.function.options, event, el)
      }))
    })
  })

  // This is necessary for conditional/computed fields
  $: if (values || errors || touched) collection = collection

</script>

<div>
  <div class="SvelteCMSEditor">
    <div class="SvelteCMSEditorForm">
      <slot name="header">
        <h2>
          {#if initialValues === {}}
            Edit
          {:else}
            New
          {/if}
          {collection?.label}
        </h2>
      </slot>
      <form on:submit="{submit}" bind:this={form}>
        {#each Object.entries(collection.fields) as [id,field]}
          {#if !field.hidden}
            <div class="field {field?.class || ''}">
              {#if !field.widget.widget}
                <CmsWidgetUndefined {field} {id} />
              {:else if field.multiple && !field.widget.handlesMultiple}
                <CmsWidgetMultiple
                  {field}
                  {id}
                  bind:value={values[id]}
                  {cms}
                  {contentTypeID}
                />
              {:else if field.widget.type === 'collection'}
                <CmsWidgetCollection
                  {field}
                  {id}
                  bind:value={values[id]}
                  {cms}
                  {contentTypeID}
                />
              {:else}
                <svelte:component
                  this={field.widget.widget}
                  {field}
                  {id}
                  bind:value={values[id]}
                />
              {/if}
            </div>
          {/if}
        {:else}
          There are no fields to edit.
        {/each}
        <slot/>
        <button
          type="submit"
          class="primary"
          {disabled}
        >
          <slot name="submit">Submit</slot>
        </button>

        <DisplayResult bind:result />

      </form>
    </div>
    {#if previewComponent}
      <div class="SvelteCMSEditorPreview">
        <svelte:component this={previewComponent} item={cms.preMount(contentTypeID, values)} ></svelte:component>
      </div>
    {/if}
  </div>
</div>
