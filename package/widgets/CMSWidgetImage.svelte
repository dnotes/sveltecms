<script context="module">export {};
</script>

<script>import DisplayResult from "../ui/DisplayResult.svelte";
import Button from "../ui/Button.svelte";
let result;
export let field;
export let id;
//@ts-ignore
let opts = field.widget.options;
let multiple = field.multiple;
let isString = !opts.altField && !opts.titleField;
// The "value" variable is where we store the url strings or CMSImage objects for the database
export let value = field.multiple ? [] : (isString ? '' : {});
// The "files" variable holds the uploaded file objects
export let files = undefined;
// The "previews" variable holds the preview images
// It is always an array
export let previews = undefined;
// The "input" variable holds the form upload element
export let input = undefined;
// The "previewUrls" variable holds the image created by uploading or running URL.createObjectURL() for each uploaded file
let previewUrls = {};
// In case an upload errors out, we display the result for a moment
let displayResult;
$: if (displayResult)
    setTimeout(() => { displayResult = undefined; }, 4000);
// The "previews" variable is a computed array of all "value" images, in the correct format for previewing
// @ts-ignore
$: previews = Array.isArray(value) ? value.map(getPreview).filter(v => v?.length || v?.src) : [getPreview(value)].filter(v => v?.length || v?.src);
// Gets a CMSPreviewImage from a CMSImage (or url string)
export let getPreview = (f) => {
    let src = typeof f === 'string' ? f : f?.src;
    return {
        src: previewUrls?.[src]?.url || previewUrls?.[src]?.blob || src,
        alt: f?.['alt'] || src,
        title: src
    };
};
// Handles uploads to the file field
export let handleUpload = async () => {
    // ensure that there is a mediastore
    if (!field?.['mediaStore'])
        throw new Error(`There is no media store for field ${field.id}`);
    // For ease of processing, get an array of all src attributes
    let srcs = previews.map(img => img.title); // The filename/url is always the title of a CMSPreviewImage
    // Check each of the uploaded files
    let promises = [...files].map(async (file) => {
        // If it does not have a previewUrl (i.e. it has not been parsed yet)
        if (!previewUrls.hasOwnProperty(file.name)) {
            let newValue;
            // FOR IMMEDIATELY UPLOADED PREVIEWS
            if (field.mediaStore.immediateUpload) {
                previewUrls[file.name] = {};
                let url;
                try {
                    url = await field.mediaStore.saveMedia(file, field.mediaStore.options);
                    file.name = url;
                    previewUrls[file.name] = { url };
                    newValue = isString ? url : { url };
                }
                catch (e) {
                    result = e;
                }
            }
            else {
                // Create an objectUrl
                let url = URL.createObjectURL(file);
                previewUrls[file.name] = {
                    url,
                    blob: file,
                };
                newValue = {
                    src: url,
                    filename: file.name,
                };
            }
            // Add to or replace "value"
            if (field.multiple) {
                if (Array.isArray(value))
                    value = [...value, newValue];
                else
                    value = [value, newValue];
            }
            else {
                value = newValue;
            }
        }
    });
    await Promise.all(promises);
    let filenames = [...files].map(f => f.name);
    let usedFilenames = [];
    if (Array.isArray(value)) {
        value = value.filter(f => {
            let ok = (f.src && !f.src.match(/^blob:/)) || (filenames.includes(f?.filename) && !usedFilenames.includes(f?.filename));
            if (ok && f?.filename)
                usedFilenames.push(f.filename);
            return ok;
        });
    }
    // Finally, release any unused objectUrl entries
    releaseObjectUrls();
};
export let deleteImage = (previewIndex) => {
    // For deleting an image, we just remove it from the value.
    // It will then be removed from previews automatically
    // (see the line `$: previews =` above)
    if (!multiple)
        value = undefined;
    else {
        let { title: url } = previews[previewIndex];
        if (Array.isArray(value)) {
            let valueIndex = value.findIndex(v => v === url || v?.['src'] === url);
            if (valueIndex > -1)
                value.splice(valueIndex, 1);
            value = value;
        }
        else {
            if (value === url || value?.['src'] === url)
                value = [];
        }
    }
    releaseObjectUrls();
};
function releaseObjectUrls() {
    Object.entries(previewUrls).forEach(([src, obj]) => {
        if (!previews.find(p => p.title === src)) {
            if (obj?.blob)
                URL.revokeObjectURL(obj.blob);
            delete previewUrls[src];
        }
    });
}
</script>

<fieldset class="cms-image" class:multiple>

  <label>
    <span style="display:inline-block;">
      <slot>{field.label}</slot>
    </span>
    <input
      name="{id}[files]"
      title={field.helptext}
      type="file"
      bind:files
      bind:this={input}
      {multiple}
      disabled={field.disabled}
      required={field.required}
      on:click|stopPropagation
      on:change={handleUpload}
      style="display:none"
    />
    <Button helptext={'Upload a new image'} on:click={()=>{input.click()}}>Upload</Button>
    {#if multiple}
      <span class="cms-image-warning">
        Warning: It is not possible to upload multiple files in series;
        either select all the files at the same time, or save the form
        multiple times. (Work in progress.)
      </span>
    {/if}
  </label>

  {#if value && Object.keys(value).length}
    <div class="cms-image-preview">
      {#if Array.isArray(value)}
        {#each previews as preview, i}
          <div>
            <img
              src="{preview.src}"
              alt="{preview.alt || ''}"
              title="{preview.title}" />

            {#if typeof value === 'string'}
              <input
                type="hidden"
                name="{id}[{i}][src]"
                bind:value={value[i]}
              >
            {:else}
              <input
                type="hidden"
                name="{id}[{i}][src]"
                bind:value={value[i]['src']}
              >
            {/if}

            <input
              type="hidden"
              name="{id}[{i}][filename]"
              value="{value[i]?.['filename'] || ''}"
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

            {#if opts.attributionField}
              <input
                type="text"
                name="{id}[{i}][attribution]"
                bind:value={value[i]['attribution']}
                placeholder="license/attribution"
                required={opts.attributionRequired}
              >
            {/if}

            <div class="delete">
              <Button type=cancel small danger
                helptext="Delete image {i+1}: {value[i]['alt'] || value[i]['filename']}"
                on:click="{() => {deleteImage(i)}}"
              />
            </div>

          </div>
        {/each}
      {:else}
        {#each previews as preview, i}
          <div>
            <img
              src="{preview.src}"
              alt="{preview.alt || ''}"
              title="{preview.title}" />

            {#if typeof value === 'string'}
              <input
                type="hidden"
                name="{id}[{i}][src]"
                bind:value={value}
              >
            {:else}
              <input
                type="hidden"
                name="{id}[{i}][src]"
                bind:value={value['src']}
              >
            {/if}

            <input
              type="hidden"
              name="{id}[{i}][filename]"
              value="{value?.['filename'] || ''}"
            >

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

            <div class="delete">
              <Button type=cancel small danger
                helptext="Delete image {i+1}: {value['alt'] || value['filename']}"
                on:click="{() => {deleteImage(i)}}" />
            </div>

          </div>
        {/each}
      {/if}
    </div>
  {/if}

  <DisplayResult bind:result />

</fieldset>

<style>

.cms-image-preview>div {
  position: relative;
  width: 144px;
  height: 144px;
}
.cms-image-preview img {
  width: 144px;
  height: 112px;
  -o-object-fit:cover;
     object-fit:cover;
  -o-object-position:center;
     object-position:center;
}
.cms-image-preview .delete {
  position: absolute;
  top: 8px;
  right: 8px;
}
.cms-image-warning {
  display: inline-block;
  font-family: helvetica, arial, sans-serif;
  font-size: 10px;
  line-height: 1em;
  width: 248px;
  vertical-align: middle;
  padding: 0;
  margin: 0;
  opacity: .5;
}</style>