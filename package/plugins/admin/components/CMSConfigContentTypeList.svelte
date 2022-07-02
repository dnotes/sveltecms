<script>import { getLabelFromID } from "sveltecms/utils";
import Button from 'sveltecms/ui/Button.svelte';
import Modal from 'sveltecms/ui/Modal.svelte';
import AddItemLine from "sveltecms/ui/AddItemLine.svelte";
export let cms;
export let basePath;
export let adminPath;
let configPath = adminPath.replace(/\/.+/, '');
let contentTypes = cms.listEntities('contentTypes');
let fields = Object.keys(cms.fields);
let addID, addLink;
let removeType, confirmRemoveType;
async function doRemove() {
    delete cms.conf.contentTypes[removeType];
    contentTypes = contentTypes.filter(t => t !== removeType);
    removeType = undefined;
    confirmRemoveType = undefined;
    return fetch('/admin/config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cms.conf),
    });
}
async function listContent(id) {
    try {
        let content = await cms.listContent(id);
        return content;
    }
    catch (e) {
        console.error(e);
        return Promise.reject();
    }
}
</script>

{#if !contentTypes.length}
  <p>It looks like you haven't created any content types yet. If so, you can create a new one below!</p>
  {#if !fields.length}
    <p>
      It's often a good idea to configure a few common fields first, like a title and body field,
      that will share configuration across all content types. You can do that on
      <a href="{basePath}/fields">the Field configuration page</a>.
    </p>
  {/if}
{/if}
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Label</th>
      <th>Fields</th>
      <th>Operations</th>
    </tr>
  </thead>
  <tbody>
    {#each contentTypes as id}
      <tr>
        <td>{id}</td>
        <td>{cms.contentTypes[id].label || getLabelFromID(id)}</td>
        <td>{Object.keys(cms.contentTypes[id].fields || {}).join(', ')}</td>
        <td>
          <a href="{basePath}/{configPath}/{id}" class="button small">configure</a>
          <Button small on:click={()=>{removeType=id}}>delete</Button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<AddItemLine>
  <div class="field"><input type="text" bind:value={addID}></div>
  <Button primary disabled={!addID} on:click={()=>{addLink.click()}}>+ add</Button>
  <a href="{basePath}/{adminPath}/{addID}" bind:this={addLink} style:display='none'>add</a>
</AddItemLine>

{#if removeType}
  <Modal>
    <p>Are you sure you want to delete the "{removeType}" content type?</p>
    {#await listContent(removeType)}
      <p>Checking for content...</p>
    {:then content}
      {#if content.length}
        <p>If you delete this content type, you will lose access to at least
          {content.length} content item(s).
          To continue, please type "{removeType}" in the field below:</p>
        <input type="text" placeholder="{removeType}" bind:value={confirmRemoveType}>
      {:else}
        <p>There is no content of this type. {(confirmRemoveType = removeType) && ''}</p>
      {/if}
    {:catch}
      <p>There was an error checking for content of this type.
        To remove it anyway, please type "{removeType}" in the field below:</p>
      <input type="text" placeholder="{removeType}" bind:value={confirmRemoveType}>
    {/await}
    <Button disabled={confirmRemoveType !== removeType} on:click={doRemove}>Delete</Button>
    <Button on:click={()=>{removeType=undefined; confirmRemoveType=undefined;}}>cancel</Button>
  </Modal>
{/if}


<style>
  th {
    text-align:left;
  }</style>