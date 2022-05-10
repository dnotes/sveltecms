<script context="module" lang="ts">
import bytes from 'bytes'
  export class CMSFile {
    src:string        // filename or blob url
    filename:string   // filename url
    title?:string
    attribution?:string
    size?:number
    type?:string
    date?:Date
    isCMSFile:true = true
    stringify:boolean = false
    toString() {
      return this.src
    }
    toJSON() {
      return this.stringify ? this.src : {
        src: this.filename || this.src,
        title: this.title,
        attribution: this.attribution,
        size: this.size,
        date: this.date,
      }
    }
    constructor(src:string|CMSFile, stringify:boolean, file?:string|File) {
      this.stringify = stringify
      this.src = typeof src === 'string' ? src : src.src
      this.title = src?.['title']
      this.filename = typeof file === 'string' ? file : (file?.['name'] || src?.['name'])
      this.attribution = src?.['attribution']
      this.size = file?.['size'] || src?.['size']
      this.type = file?.['type'] || src?.['type']
      this.date = src?.['date'] ? new Date(src?.['date']) : new Date()
    }
    get displayDate() {
      return `${this.date.getFullYear()}-${this.date.getMonth()}-${this.date.getDate()} ${this.date.getHours()}:${this.date.getMinutes()}`
    }
    get displaySize() {
      return bytes.format(this.size)
    }
  }

</script>

<script lang="ts">
import type { WidgetField } from "..";
import DisplayResult from "../components/DisplayResult.svelte";

  export let field:WidgetField
  export let id:string

  //@ts-ignore
  let opts:{
    accept:string
    titleField:boolean
    attributionField:boolean
    attributionRequired:boolean
    storeStats:boolean
    hideHeader:boolean
  } = field.widget.options

  let multiple = field.multiple
  let stringify = !opts.titleField && !opts.attributionField && !opts.storeStats

  // The "value" variable is where we store the url strings or CMSImage objects for the database
  export let value:string|CMSFile|Array<string|CMSFile>
  let initialized

  $: if (!initialized) {
    initialized = true
    if (value) value = Array.isArray(value) ? value.map(v => new CMSFile(v, stringify)) : new CMSFile(value, stringify)
  }

  // The "files" variable holds the uploaded file objects
  export let files

  // The "input" variable holds the form upload element
  export let input = undefined

  // The "previewUrls" variable holds the image created by uploading or running URL.createObjectURL() for each uploaded file
  let previewUrls:{[filename:string]:{
    url?:string,
    blob?:string,
  }} = {}

  // In case an upload errors out, we display the result for a moment
  let result
  $: if (result) setTimeout(() => { result = undefined }, 4000)

  // Handles uploads to the file field
  function handleUpload() {

    // ensure that there is a mediastore
    if (!field?.['mediaStore']) result = new Error(`There is no media store for field ${field.id}`);

    // Check each of the uploaded files
    [...files].forEach(async file => {

      // If it does not have a previewUrl (i.e. it has not been parsed yet)
      if (!previewUrls.hasOwnProperty(file.name)) {

        let newValue:CMSFile

        // FOR IMMEDIATELY UPLOADED PREVIEWS
        if (field.mediaStore.immediateUpload) {

          previewUrls[file.name] = {}
          let url
          try {
            url = await field.mediaStore.saveMedia(file, field.mediaStore.options)
            file.name = url
            previewUrls[file.name] = { url }
            newValue = new CMSFile(url, stringify, file)
          }
          catch(e) {
            result = e
          }

        }
        else {
          // Create an objectUrl
          let url = URL.createObjectURL(file)
          previewUrls[file.name] = {
            url,
            blob: file,
          }
          newValue = new CMSFile(url, stringify, file)
        }

        // Add to or replace "value"
        if (field.multiple) {
          if (Array.isArray(value)) value = [...value, newValue]
          else value = [value,newValue] // needed in case config changes
        }
        else {
          value = newValue
        }

      }

    })

    // Finally, release any unused objectUrl entries
    releaseObjectUrls()

  }

  function deleteFile(index=0) {
    if (!multiple) value = undefined
    else if (Array.isArray(value)) {
      value.splice(index,1)
      value = value
    }
    else value = []
    releaseObjectUrls()
  }

  function releaseObjectUrls() {
    Object.entries(previewUrls).forEach(([filename,obj]) => {
      let found = Array.isArray(value) ? value.find(v => (v?.['filename'] === filename)) : value?.['filename'] === filename
      if (!found) {
        if (obj?.blob) URL.revokeObjectURL(obj.blob)
        delete previewUrls[filename]
      }
    })
  }

</script>

<fieldset class="cms-image" class:multiple>

  <label>
    <span style="display:inline-block;">
      <slot>{field.label}</slot>
    </span>

    {#if initialized}

      <table>
        {#if !opts.hideHeader && Array.isArray(value)}
        <thead>
          <th>File</th>
          {#if opts.storeStats}
            <th>Type</th>
            <th>Size</th>
            <th>Date</th>
          {/if}
          <th>Delete</th>
        </thead>
        {/if}

        <tbody>

          {#if Array.isArray(value)}
            {#each value as file,i}
              <td class="item">
                <span>{file['filename']}</span>
                <input type="hidden" name="{id}[{i}][src]" bind:value={value[i]['src']}>
                <input type="hidden" name="{id}[{i}][filename]" bind:value={value[i]['filename']}>
                {#if opts.titleField}
                  <input type="text" placeholder="title" name="{id}[{i}][title]" bind:value={value[i]['title']}>
                {/if}
                {#if opts.attributionField}
                  <input type="text" placeholder="attribution" name="{id}[{i}][attribution]" bind:value={value[i]['attribution']}>
                {/if}
              </td>
              {#if opts.storeStats}
                <td>{file['type'] || 'unknown'}</td>
                <td>{file['displaySize'] || 'unknown'}</td>
                <td>{file['displayDate'] || 'unknown'}</td>
              {/if}
              <td><button type="button" on:click={()=>{deleteFile(i)}}>✖️</button></td>
            {/each}
          {:else}
            <td class="item">
              <span>{value['filename']}</span>
              <input type="hidden" name="{id}[src]" bind:value={value['src']}>
              <input type="hidden" name="{id}[filename]" bind:value={value['filename']}>
              {#if opts.titleField}
                <input type="text" placeholder="title" name="{id}[title]" bind:value={value['title']}>
              {/if}
              {#if opts.attributionField}
                <input type="text" placeholder="attribution" name="{id}[attribution]" bind:value={value['attribution']}>
              {/if}
            </td>
            {#if opts.storeStats}
              <td>{value['type'] || 'unknown'}</td>
              <td>{value['displaySize'] || 'unknown'}</td>
              <td>{value['displayDate'] || 'unknown'}</td>
            {/if}
            <td><button type="button" on:click={()=>{deleteFile()}}>✖️</button></td>
          {/if}

        </tbody>
      </table>

    {/if}


    <input
      name="{id}[files]"
      title={field.tooltip}
      type="file"
      bind:files
      bind:this={input}
      {multiple}
      disabled={field.disabled}
      required={field.required}
      on:change={handleUpload}
      style="display:none"
    />
    <button type="button" style="display:inline-block;" on:click={()=>{input.click()}}>Upload</button>
  </label>

  {#if result}
    <DisplayResult bind:result />
  {/if}

</fieldset>
