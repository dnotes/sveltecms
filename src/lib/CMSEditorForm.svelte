<script lang="ts">
import type SvelteCMS from './index';
import CmsFieldCollection from './CMSFieldCollection.svelte';
import DisplayResult from './components/DisplayResult.svelte'
import { cloneDeep } from 'lodash-es'
import { onDestroy, onMount } from 'svelte';

  export let cms:SvelteCMS
  export let contentTypeID:string

  export let result = undefined
  export let values = {}
  export let errors = {}
  export let touched = {}
  export let disabled = false
  export let submitOptions = {}

  export const contentType = cms.getContentType(contentTypeID)
  let widgetFieldCollection = cms.getWidgetFields(contentType, { values, errors, touched })

  export let action = contentType?.form?.action ?? ''
  export let method = contentType?.form?.method ?? 'POST'
  export let previewComponent = contentType?.form?.previewComponent

  const initialValues = cloneDeep(values)

  // export let validator:Validator.Validator<Object> = cms.getValidator(contentTypeID, values)

  // $: if (values) {
  //   disabled = validator.fails()
  //   errors = validator.errors.all()
  // }

  export let submit = async (event)=>{
    if (method) {
    }
    else {
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
  }

</script>

<div>
  <div class="cms-editor">
    <div class="cms-editor-form">
      <slot name="header">
        <h2>
          {#if initialValues === {}}
            Edit
          {:else}
            New
          {/if}
          {widgetFieldCollection?.label}
        </h2>
      </slot>
      <form on:submit="{submit}" {action} {method} enctype={method.match(/post/i) ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
        <CmsFieldCollection {cms} {values} collection={contentType} />
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
      <div class="cms-editor-preview">
        <svelte:component this={previewComponent} item={cms.preMount(cms.getContentType(contentTypeID), values)} ></svelte:component>
      </div>
    {/if}
  </div>
</div>
