<script lang="ts">
import type SvelteCMS from './index';
import CmsFieldGroup from './CMSFieldGroup.svelte';
import DisplayResult from 'sveltecms/ui/DisplayResult.svelte'
import { cloneDeep, debounce } from 'lodash-es'
import Button from './ui/Button.svelte';
import ContentItem from './display/ContentItem.svelte';

  export let cms:SvelteCMS
  export let contentTypeID:string

  export let result = undefined
  export let values = {}
  export let errors = {}
  export let touched = {}
  export let disabled = false
  export let submitOptions = {}
  export let isNew = undefined

  export const contentType = cms.getContentType(contentTypeID)
  let widgetFieldGroup = cms.getWidgetFields(contentType, { values, errors, touched })

  export let action = contentType?.form?.action ?? ''
  export let method = contentType?.form?.method ?? 'POST'
  let component = contentType?.display?.component?.component || ContentItem

  const initialValues = cloneDeep(values)
  let oldSlug = values?.['_slug'] ?? ''

  let previewContent = cms.preMount(contentType, values)
  let updatePreviewContent = debounce(()=>{previewContent = cms.preMount(contentType, values)}, 500)
  $: if (values) updatePreviewContent()

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
          {#if isNew || initialValues === {}}
            New
          {:else}
            Edit
          {/if}
          {widgetFieldGroup?.label}
        </h2>
      </slot>
      <form on:submit="{submit}" {action} {method} enctype={method.match(/post/i) ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
        <CmsFieldGroup {cms} bind:values {widgetFieldGroup} />

        <input type="hidden" name="_slug" bind:value={oldSlug}>
        <input type="hidden" name="_oldSlug" value={oldSlug}>

        <Button
          submit
          primary
          {disabled}
        >
          <slot name="submit">Submit</slot>
        </Button>

        <DisplayResult bind:result />

      </form>
    </div>
    {#if component}
      <div class="cms-editor-preview">
        <svelte:component this={component} {cms} entity={contentType} item={previewContent} ></svelte:component>
      </div>
    {/if}
  </div>
</div>
