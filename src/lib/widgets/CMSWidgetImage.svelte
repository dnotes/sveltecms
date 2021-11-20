<script context="module" lang="ts">

  export type CMSImage = {
    src:string
    alt?:string
    title?:string
    cropCoorinatesXY?:{
      leftTop:string
      rightBottom:string
    }
  }

  export type CMSPreviewImage = CMSImage & {
    title:string // The title attribute will always hold the url or filename of a preview image
  }

</script>

<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

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

  // The "value" variable is where we store the url strings or CMSImage objects for the database
  export let value:string|CMSImage|string[]|CMSImage[]|{} = field.multiple ? [] : (isString ? '' : {})

  // The "files" variable holds the uploaded file objects
  let files

  // The "input" variable holds the form upload element
  let input

  // The "objectUrls" variable holds the image created by URL.createObjectURL() for each uploaded file
  let objectUrls:{[filename:string]:string} = {}

  // The "previews" variable is a computed array of all "value" images, in the correct format for previewing
  // @ts-ignore
  $: previews = Array.isArray(value) ? value.map(getPreview).filter(v => v?.length || v?.src) : [getPreview(value)].filter(v => v?.length || v?.src)

  // Gets a CMSPreviewImage from a CMSImage (or url string)
  function getPreview(f:string|CMSImage):CMSPreviewImage {
    let src = typeof f === 'string' ? f : f?.src
    return {
      src: objectUrls?.[src] || src,
      alt: f?.['alt'] || src,
      title: src
    }
  }

  // Handles uploads to the file field
  function handleUpload() {

    // For ease of processing, get an array of all src attributes
    let srcs = previews.map(img => img.title); // The filename/url is always the title of a CMSPreviewImage

    // Check each of the uploaded files
    [...files].forEach(file => {
      // If it does not have an objectUrl (i.e. it has not been parsed yet)
      if (!objectUrls[file.name]) {
        // Create an objectUrl
        objectUrls[file.name] = URL.createObjectURL(file)
        // Create newValue to add to or replace the "value" variable
        let newValue = isString ? file.name : { src:file.name }
        // Add to or replace "value"
        if (field.multiple) {
          if (Array.isArray(value)) value = [...value, newValue]
          else value = [value,newValue]
        }
        else {
          value = newValue
        }
      }
    })

    // Finally, release any unused objectUrl entries
    releaseObjectUrls()

  }

  function deleteImage(previewIndex) {
    console.log(value)
    // For fields that are not multiple, we can just delete the database object
    if (!multiple) {
      if (isString) value = ''
      else value = {}
    }
    else {
      let { title:url } = previews[previewIndex]
    }
  }

  function releaseObjectUrls() {
    Object.entries(objectUrls).forEach(([src,url]) => {
      if (!previews.find(p => p.title === src)) URL.revokeObjectURL(url)
    })
  }

</script>

<fieldset class="cms-image" class:multiple>

  <label>
    <span style="display:inline-block;">
      <slot>{field.title}</slot>
    </span>
    <input
      name="{id}[files]"
      title={field.description}
      type="file"
      bind:files
      bind:this={input}
      {multiple}
      disabled={field.disabled}
      required={field.required}
      on:change={handleUpload}
      style="display:none"
    />
    <button style="display:inline-block;" on:click={()=>{input.click()}}>Upload</button>
  </label>

  <div class="cms-image-preview">
    {#if Array.isArray(value)}
      {#each previews as preview, i}
        <div>
          <button class="cms-image-delete" aria-label="delete {field.title} image" on:click="{() => {deleteImage(i)}}">✖️</button>
          <img
            src="{preview.src}"
            alt="{preview.alt || ''}"
            title="{preview.title}" />

          <input
            type="hidden"
            name="{id}[{i}]"
            value="{typeof value[i] === 'string' ? value[i] : value[i]?.['src']}"
          >

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
      {#each previews as preview, i}
        <div>
          <button class="cms-image-delete" aria-label="delete {field.title} image" on:click="{() => {deleteImage(i)}}">✖️</button>
          <img
            src="{preview.src}"
            alt="{preview.alt || ''}"
            title="{preview.title}" />

          {#if typeof value === 'string'}
            <input
              type="hidden"
              name="{id}[{i}]"
              bind:value={value}
            >
          {:else}
            <input
              type="hidden"
              name="{id}[{i}][src]"
              bind:value={value['src']}
            >
          {/if}

          {#if opts.altField}
            <input
              type="text"
              name="{id}[{i}][alt]"
              bind:value={value['alt']}
              placeholder="alt"
              required={opts.altRequired}
            >
          {/if}

          {#if opts.titleField}
            <input
              type="text"
              name="{id}[{i}][title]"
              bind:value={value['title']}
              placeholder="title"
            >
          {/if}

        </div>
      {/each}
    {/if}
  </div>

</fieldset>

<style>

</style>