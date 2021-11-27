<script lang="ts">
import type SvelteCMS from './index';
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import * as lodash from 'lodash'
const { cloneDeep } = lodash

  export let cms:SvelteCMS
  export let contentTypeID:string
  export let previewComponent = undefined

  let contentType = cms.types[contentTypeID]

  export let values = {}
  export let errors = {}
  export let disabled = false
  export let submitOptions = {}

  export let initialValues = undefined
  if (initialValues) values = cloneDeep(initialValues)

  // export let validator:Validator.Validator<Object> = cms.getValidator(contentTypeID, values)

  // $: if (values) {
  //   disabled = validator.fails()
  //   errors = validator.errors.all()
  // }

  export let submit = async (event)=>{
    event.preventDefault()
    try {
      console.log('saving...')
      let res = await cms.saveContent(contentTypeID, values, submitOptions)
      console.log(res)
    }
    catch(e) {
      console.error(e)
    }
  }

</script>

<div>
  <div class="SvelteCMSEditor">
    <div class="SvelteCMSEditorForm">
      <slot name="header">
        <h2>
          {#if initialValues}
            Edit
          {:else}
            New
          {/if}
          {contentType?.title}
        </h2>
      </slot>
      <form on:submit="{submit}">
        {#each Object.entries(contentType.fields) as [id,field]}
          <div class="field {field?.class || ''}">
            {#if !field.widget.widget}
              <CmsWidgetUndefined {field} {id} />
            {:else if field.multiple && !field.widget.handlesMultiple}
              <CmsWidgetMultiple
                {field}
                {id}
                bind:value={values[id]}
              />
            {:else}
              <svelte:component
                this={field.widget.widget}
                {field}
                {id}
                bind:value={values[id]}
                bind:errors={errors[id]}
              />
            {/if}
          </div>
        {:else}
          There are no fields to edit.
        {/each}
        <slot/>
        <button
          type="submit"
          {disabled}
        >
          <slot name="submit">Submit</slot>
        </button>
      </form>
    </div>
    {#if previewComponent}
      <div class="SvelteCMSEditorPreview">
        <svelte:component this={previewComponent} item={cms.preMount(contentTypeID, values)} ></svelte:component>
      </div>
    {/if}
  </div>
</div>
