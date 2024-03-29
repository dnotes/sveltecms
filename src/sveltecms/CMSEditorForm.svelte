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
  export let values = { _type:contentTypeID }
  export let errors = {}
  export let touched = {}
  export let disabled = false
  export let submitOptions = {}
  export let isNew = undefined

  export const contentType = cms.getContentType(contentTypeID)
  let widgetFieldGroup = cms.getWidgetFields(contentType, { values, errors, touched })

  export let action = contentType?.form?.action ?? '?/post'
  export let method = contentType?.form?.method ?? 'POST'

  values['_oldSlug'] = values['_slug'] ?? ''
  const initialValues = cloneDeep(values)

  let okMove
  $: newSlug = cms.getSlug(values, contentType.slug, true)

  let previewContent = cms.preMount(contentType, values)
  let updatePreviewContent = debounce(()=>{
    previewContent = cms.preMount(contentType, values)
    if (okMove && values['_slug'] !== newSlug) values['_slug'] = newSlug
  }, 500)
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
          {#if isNew}
            New
          {:else}
            Edit
          {/if}
          {widgetFieldGroup?.label}
        </h2>
      </slot>
      <form on:submit="{submit}" {action} {method} enctype={method.match(/post/i) ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
        <CmsFieldGroup {cms} bind:values {widgetFieldGroup} />

        <input type="hidden" name="_type" value={values['_type']}>
        <input type="hidden" name="_slug" bind:value={values['_slug']}>
        <input type="hidden" name="_oldSlug" value={values['_oldSlug']}>

        {#if values['_oldSlug'] && newSlug !== values['_oldSlug']}
        <div>
          <label>
            <input type="checkbox" name="[move]" bind:checked={okMove} on:change={updatePreviewContent} />
            Move this content from <code>{contentType.id}/{values['_oldSlug']}</code> to <code>{contentType.id}/{newSlug}</code>
          </label>
        </div>
        {/if}

        <div class="actions">
          <Button
            submit
            primary
            formaction='?/post'
            {disabled}
          >
            <slot name="submit">Submit</slot>
          </Button>

          {#if values['_oldSlug']}
            <Button href="{contentTypeID === cms.conf.settings.rootContentType ? '' : '/' + contentTypeID}/{values['_oldSlug']}">view</Button>

            <div class="spacer"></div>

            <Button danger formaction="?/delete" text="delete"/>
          {/if}
        </div>

        <DisplayResult bind:result />

      </form>
    </div>
    <div class="cms-editor-preview">
      <ContentItem
        {cms}
        entity={contentType}
        item={previewContent}
        displayMode="page"
      />
    </div>
  </div>
</div>

<style>
  div.actions { display:flex; gap:.5em; }
  div.spacer { flex-grow:1; }
</style>