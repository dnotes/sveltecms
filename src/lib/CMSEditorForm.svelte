<script lang="ts">
import type SvelteCMS from './index';
import CmsWidgetMultiple from './widgets/CMSWidgetMultiple.svelte';
import CmsWidgetUndefined from './widgets/CMSWidgetUndefined.svelte';
import { cloneDeep } from 'lodash'

  export let cms:SvelteCMS
  export let contentTypeID:string

  let contentType = cms.types[contentTypeID]

  export let values = {}
  let errors = {}
  let disabled

  export let initialValues = undefined
  if (initialValues) values = cloneDeep(initialValues)

  // export let validator:Validator.Validator<Object> = cms.getValidator(contentTypeID, values)

  // $: if (values) {
  //   disabled = validator.fails()
  //   errors = validator.errors.all()
  // }

  export let submit = async ()=>{
    try {
      let result = await cms.save(contentTypeID, values)
      // TODO: determine save api, check for errors in results
    }
    catch(e) {
      // TODO: catch errors and display error messages
    }
  }

</script>

<div>
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
  <form
    class="SvelteCMSEditorForm"
    on:submit|preventDefault="{submit}"
  >
    {#each Object.entries(contentType.fields) as [id,field]}

      <div class="field">
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
