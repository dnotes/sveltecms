<script>import CmsEditorForm from "../../CMSEditorForm.svelte";
export let cms;
export let adminPath;
$: [contentPath, contentTypeID, slug] = adminPath.split('/');
$: type = cms.getContentType(contentTypeID);
$: content = cms.getContent(contentTypeID, slug, { getRaw: true });
</script>

{#await content then values}
  <CmsEditorForm {contentTypeID} {values} {cms} method={type.form.method} action={type.form.action} previewComponent={type.form.previewComponent} />
{:catch error}
  Error loading content:
{/await}