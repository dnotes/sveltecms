<script context="module" lang="ts">

  export type CMSImage = {
    src:string
    alt?:string
    title?:string
    cropCoorinatesXY:{
      leftTop:string
      rightBottom:string
    }
  }

</script>

<script lang="ts">
import type { SvelteCMSContentField } from "$lib";
import { cloneDeep, isArray } from "lodash";

  export let field:SvelteCMSContentField
  export let id:string

  //@ts-ignore
  let opts:{
    accept:boolean
    altField:boolean
    altRequired:boolean
    titleField:boolean
    createThumbnail:boolean
    thumbnailHeight:number
    thumbnailWidth:number
  } = field.widget.options

  let multiple = field.multiple
  let isString = !opts.altField && !opts.titleField && !opts.createThumbnail

  export let value = field.multiple ? [] : (isString ? '' : {})
  let files

</script>

<fieldset class="cms-image" class:multiple>

  <label>
    <span>
      <slot>{field.title}</slot>
    </span>
    <input
      name="{id}[files]"
      title={field.description}
      type="file"
      bind:files
      {multiple}
      disabled={field.disabled}
      required={field.required}
    />
  </label>

  <div class="cms-image-preview">
  {#if Array.isArray(value)}
    {#each value as file, i}
      <div>
        <button class="cms-image-delete" aria-label="delete {field.title} image">✖️</button>
        <img
          src="{typeof file === 'string' ? file : file.src}"
          alt="{file?.['alt']}"
          title="{file?.['title']}" />
          {#if isString}
            <input
              type="hidden"
              name="{id}[{i}]"
              bind:value={value[i]}
            >
          {:else}
            <input
              type="hidden"
              name="{id}[{i}][src]"
              bind:value={value[i]['src']}
            >
          {/if}
        {#if opts.altField}
          <input
            type="text"
            name="{id}[{i}][alt]"
            bind:value={value[i]['alt']}
            placeholder="alt"
            required={opts.altRequired}
          >
        {/if}
        {#if opts.titleField}
          <input
            type="text"
            name="{id}[{i}][title]"
            bind:value={value[i]['title']}
            placeholder="title"
          >
        {/if}
      </div>
    {/each}
  {:else}
    <div>
      <img
        src="{typeof value === 'string' ? value : value['src']}"
        alt="{value?.['alt']}"
        title="{value?.['title']}" />
        {#if typeof value === 'string'}
          <input
            type="hidden"
            name="{id}"
            bind:value
          >
        {:else}
          <input
            type="hidden"
            name="{id}[src]"
            bind:value={value['src']}
          >
        {/if}
      {#if opts.altField}
        <input
          type="text"
          name="{id}[alt]"
          bind:value={value['alt']}
          placeholder="alt"
          required={opts.altRequired}
        >
      {/if}
      {#if opts.titleField}
        <input
          type="text"
          name="{id}[title]"
          bind:value={value['title']}
          placeholder="title"
        >
      {/if}
    </div>
  {/if}
</div>

</fieldset>

<style>

</style>