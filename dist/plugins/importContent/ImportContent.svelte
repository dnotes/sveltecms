<script>export let cms;
let values = {
    dir: '',
    format: 'md',
    bodyField: 'body',
    referenceFields: '',
    indexedFields: '',
    contentTypeID: '',
    slugFields: '',
    createContentType: false,
    importContent: false,
};
export let runImport = async () => {
    return fetch('/admin/import', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });
};
</script>

<form>

  <h3>Content Type</h3>

  <div class="field">
    <label>
      <span>Content Type ID</span>
      <input name="contentTypeID" required type="text" bind:value={values.contentTypeID}>
    </label>
  </div>

  <div class="field">
    <label>
      <span>Slug fields</span>
      <input name="slugFields" required type="text" bind:value={values.slugFields}>
    </label>
  </div>

  <div class="field">
    <label>
      <span>Reference Fields</span>
      <input name="referencedFields" required type="text" bind:value={values.referenceFields}>
    </label>
  </div>

  <div class="field">
    <label>
      <span>Indexed fields</span>
      <input name="indexedFields" required type="text" bind:value={values.indexedFields}>
    </label>
  </div>

  <div class="field">
    <label>
      <input type="checkbox" disabled={cms.contentTypes[values.contentTypeID] ? true : false} bind:checked={values.createContentType}>
      <span>Create a content type</span>
    </label>
  </div>

  <div class="field">
    <label>
      <input type="checkbox" bind:checked={values.importContent}>
      <span>Import content</span>
    </label>
  </div>

  <h3>Import from...</h3>

  <div class="field">
    <label>
      <span>Folder to import</span>
      <input name="dir" required type="text" bind:value={values.dir}>
    </label>
  </div>

  <div class="field">
    <label>
      <span>Content file format</span>
      <select name="format" required bind:value={values.format}>
        <option value="md">Markdown</option>
        <option value="json">JSON</option>
        <option disabled value="yml">YAML</option>
      </select>
    </label>
  </div>

  {#if values.format === 'md'}
    <div class="field">
      <label>
        <span>Field for Markdown body</span>
        <input name="dir" required type="text" bind:value={values.bodyField}>
      </label>
    </div>
  {/if}

  <button type="submit" disabled={!values.importContent && !values.createContentType} on:click|preventDefault={runImport}>Import</button>

</form>

<style>
  button { margin-top: 20px; }</style>