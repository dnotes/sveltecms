<script>import { cloneDeep } from 'lodash-es';
import Button from '../ui/Button.svelte';
import Modal from '../ui/Modal.svelte';
/**
 * This widget is a helper for widgets and Fields that handle media.
 *
 * Scenarios:
 *
 * 1. A new piece of Content is being created, with a Field that handles Media.
 *    The Widget will instantiate this component with a value of '' or {} or [].
 *    The "previews" array will be empty.
 *    As new Media is uploaded, chosen, or linked, the previews must be updated.
 *    When the Content is saved, any uploaded Media will be saved along with
 *    the field value. (formDataHandler)
 *    After all Content has been saved, the Media Index will be updated with all
 *    changes to Media fields. (in a contentPostWrite hook)
 *
 * 2. A piece of Content is being edited, with a Field that handles Media.
 *    The Widget will instantiate this component with a value that is a string,
 *    Media, or an array of the same.
 *    The "_previews" and "previews" arrays should be created from the initial value.
 *    Media will be saved an indexed as in 1.
 *
 * 3. A piece of Content is being deleted, with a Field that handles Media.
 *    The Widget is instantiated as in 2.
 *    Uploaded Media is not saved.
 *    After the Content is deleted, the Media Index will be updated with all
 *    changes to Media fields. (in a contnetPostDelete hook)
 *
 * B. If the mediaStore is immediateUpload, any uploaded Media is uploaded immediately,
 *    and the "previews" are created with actual URLs. If any previews are deleted,
 *    the uploaded Media is also deleted immediately.
 */
export let field;
export let id;
export let cms;
export let value;
export let files = undefined;
// Set up previews, in case the value was provided
let _previews = (Array.isArray(value) ?
    value.map(v => typeof v === 'string' ? { src: v } : v) :
    [(typeof value === 'string' ? { src: value } : value)]).filter(Boolean);
let showModal = false;
let requests = [];
let input;
let linkInput;
let allMedia = [];
// @ts-ignore When you getIndex(_media) then it's Media TODO: fix this type
let libraryQuery = cms.indexer.getIndex('_media').then(media => allMedia = media);
let libraryItems;
$: libraryItems = allMedia.filter(item => (item?._meta && (field.mediaTypes.includes(item._meta.type) || // exact type
    field.mediaTypes.includes(item._meta.type.replace(/\/.+/, '/*')) || // wildcard type
    field.mediaTypes.includes(item._meta.name.replace(/^.+\./, '.')) // file extension
)));
let result;
/**
 * Handle Uploads to the file input
 */
async function handleUpload() {
    // ensure that there is a mediastore
    if (!field?.['mediaStore'])
        throw new Error(`There is no media store for field ${field.id}`);
    // For immediate uploads:
    // 1. Upload file, 2. Ensure derivatives, 3. Update _previews[], 4. Update previews[]
    // Check each of the uploaded files
    let promises = [...files ?? []].map(async (file) => {
        // If it does not have a previewUrl (i.e. it has not been parsed yet)
        if (!_previews.find(p => p?._meta?.name === file.name)) {
            // FOR IMMEDIATELY UPLOADED PREVIEWS
            if (field.mediaStore.immediateUpload) {
                try {
                    let src = await field.mediaStore.saveMedia(file, field.mediaStore.options);
                    return { src, _meta: { name: file.name, type: file.type, size: file.size, date: new Date() } };
                }
                catch (e) {
                    result = e;
                }
            }
            else {
                // Create an objectUrl
                let src = URL.createObjectURL(file);
                return { src, _blob: file, _meta: { name: file.name, type: file.type, size: file.size, date: new Date() } };
            }
        }
    });
    let newValues = await Promise.all(promises);
    await addFiles(newValues);
}
async function handleDelete(items) {
    items.forEach(item => {
        let idx = _previews.findIndex(_p => item?.src === _p?.src);
        if (idx > -1) {
            if (field.mediaStore.immediateUpload) {
                // @TODO: make sure the file is deleted on the server
            }
            if (_previews[idx]._blob) {
                URL.revokeObjectURL(_previews[idx].src);
            }
            _previews.splice(idx, 1);
        }
    });
}
async function handleLink(src) {
    // TODO: verify mime type of linked content
    // TODO: provide option to download linked content
    await addFiles({ src, _meta: { date: new Date() } });
}
/**
 * Function to add a Media item to the _previews and the value.
 * @param item
 */
async function addFiles(items) {
    items = Array.isArray(items) ? items : [items];
    _previews.push(...items);
    let newValues = items.map(item => ({ ...cloneDeep(item), _blob: undefined }));
    if (Array.isArray(value))
        value = [...value, ...newValues];
    else if (value) {
        if (field.multiple)
            value = [value, ...newValues];
        else
            value = newValues[0];
    }
    else {
        if (field.multiple)
            value = [...newValues];
        else
            value = newValues[0];
    }
    showModal = false;
}
// In case an upload errors out, we display the result for a moment
let displayResult;
$: if (displayResult)
    setTimeout(() => { displayResult = undefined; }, 4000);
/**
 * Keep local _previews in sync with exported _previews
 *
 * Widgets will implement their own UI for previewing files, and
 * part of that will be a way to delete files. We need to ensure that
 * our store of "_previews" is synchronized with the Widget's "value"
 * whenever a file is deleted.
 * However, we also need to update the "value" when a file is added.
 * To do this:
 * 1. Respond only to changes in "value", not "_previews"
 * 2. Check if the number of values has changed (i.e. deleted or added an item)
 * 3. If an item is added, change "_previews" first, then "value"
 */
$: itemCount = Array.isArray(value) ? value.length : (value ? 1 : 0);
$: if (value || !value) {
    if (itemCount !== _previews.length) { // TODO: check this doesn't get called when _previews is updated
        let deletedItems = _previews.filter(_p => {
            if (!value)
                return true; // all items have been deleted
            if (Array.isArray(value))
                return !value.find(v => v?.src === _p?.src); // find the deleted item
            if (value?.src === _p?.src)
                return true;
        });
        requests.push(handleDelete(deletedItems));
    }
}
</script>

<input
  class="sveltecms-file-input"
  bind:files
  bind:this={input}
  name="{id}['files']"
  type="file"
  accept="{field.mediaTypes.join(',') || 'text/plain'}"
  multiple={field.multiple}
  disabled={field.disabled}
  required={field.required && !_previews?.length}
  on:change={handleUpload}
/>

<Button  on:click={()=>{showModal=true}}>Choose Media</Button>

{#if showModal}
<Modal on:cancel={()=>{showModal=false}}>
  <h2 slot="title">Choose Media</h2>
  <div class="column">

    <div class="chooser-header row">

      <div class="upload row">
        <Button primary on:click={()=>{input.click()}}>Upload</Button>
        {#if field.multiple || true}
          <span class="cms-image-warning">
            Warning: It is not possible to upload multiple files in series;
            either select all the files at the same time, or save the form
            multiple times. (Work in progress.)
          </span>
        {/if}

      </div>

      <div class="link row">
        <div class="label">External Link:</div>
        <div class="input"><input type="text" placeholder="https://example.com/etc/image.jpg" bind:this={linkInput}></div>
        <Button primary on:click={()=>{handleLink(linkInput.value)}}>Add</Button>
      </div>

    </div>

    <h3>Media Library</h3>

    <div class="library">
      {#await libraryQuery}
        <em>getting media library...</em>
      {:then value}
        {#each libraryItems as item}
          <div class="library-item" class:wide={item?._meta?.type?.startsWith('audio')}>
            <div class="src">
              {item?.src}
            </div>
            <div class="flex">
              {#if item?._meta?.type?.startsWith('image')}
                <div class="preview">
                  <img src="{item?.src}" alt="{item?.alt?.toString() || ''}" />
                </div>
              {:else if  item?._meta?.type?.startsWith('audio')}
                <div class="preview">
                  <audio controls src="{item?.src}" />
                </div>
              {:else}
                <div class="preview no-preview">{item?.src?.replace(/.+\./, '.').replace(/\?.+/, '')}</div>
              {/if}
              <div class="details">
                {#if item?._meta?.name}
                  <div><span>Name:</span>{item._meta.name}</div>
                {/if}
                {#if item?._meta?.type}
                  <div><span>Type:</span>{item._meta.type}</div>
                {/if}
                {#if item?._meta?.date}
                  <div><span>Date:</span>{new Date(item._meta.date).toLocaleDateString(undefined)}</div>
                {/if}
                {#if item?._meta?.width && item?._meta?.height}
                  <div><span>Dimensions:</span>{item._meta.height}&times;{item._meta.height}</div>
                {/if}
                {#if item?._meta?.duration}
                  <div><span>Duration:</span>{item._meta.duration}s</div>
                {/if}
              </div>
              <div class="actions">
                <Button on:click={()=>{addFiles(item)}}>+add</Button>
              </div>
            </div>
          </div>
        {:else}
           <!-- empty list -->
          <p>No library items found.</p>
        {/each}
      {:catch error}
        <p>There was an error getting the media library.</p>
      {/await}
    </div>

  </div>
</Modal>
{/if}

<style>
  .sveltecms-file-input { display:none; }
  .row { display:flex; justify-content:left; align-items:center; gap:.6em; }
  .column { display:flex; flex-direction:column; gap:1em; }
  .chooser-header { flex-wrap: wrap; width:100%; }

  .link { flex-grow:1; min-width:240px; }
  .link>div { flex-shrink:1; }
  .link input { width:100%; }
  .link .label { line-height:1em; }
  .link .input { flex-grow:1; max-width:500px; }

  .cms-image-warning {
    display: inline-block;
    font-family: helvetica, arial, sans-serif;
    font-size: 10px;
    line-height: 1em;
    max-width: 248px;
    padding: 0;
    margin: 0;
    opacity: .5;
  }

  .library {
    display:flex;
    flex-wrap:wrap;
    gap:.8em;
  }
  .library-item {
    width:320px;
    height:170px;
    max-width:100%;
    border:1px solid var(--cms-main);
    border-radius:6px;
    overflow:hidden;
    position:relative;
  }
  div.flex {
    display:flex;
  }
  .library-item.wide div.flex {
    flex-direction: column;
  }
  div.src {
    width:100%;
    padding:2px 4px;
    background-color:var(--cms-main);
    color:var(--cms-bg);
    font-weight:bold;
    white-space:pre;
    height: 30px;
    line-height: 30px;
    text-align: right;
  }
  div.preview {
    padding:0;
    margin:0;
    align-self:flex-start;
    width:140px;
    height:140px;
  }
  .wide div.preview {
    width: 100%;
    height: auto;
  }
  div.preview>img {
    -o-object-fit:contain;
       object-fit:contain;
  }
  div.no-preview {
    display:flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    background-color: rgba(127,127,127,.2);
  }
  div.preview>audio {
    width:320px;
    max-width:100%;
  }

  div.details {
    padding: .5em;
    font-size: 80%;
    opacity: .8;
  }
  div.details div {
    max-width:100%;
    line-height:1.4em;
    height:1.4em;
  }
  div.details span {
    width: 60px;
    display: inline-block;
  }
  div.actions {
    position:absolute;
    bottom: 5px;
    right: 5px;
  }</style>
