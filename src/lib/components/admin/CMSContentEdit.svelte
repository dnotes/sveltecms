<script lang="ts">
import type SvelteCMS from "../.."
import CmsEditorForm from "../../CMSEditorForm.svelte"

  export let cms:SvelteCMS
  export let adminPath:string

  $: [contentPath,contentTypeID,slug] = adminPath.split('/')
  $: type = cms.getContentType(contentTypeID)
  $: content = cms.getContent(contentTypeID, slug, { getRaw:true })

</script>

{#await content then values}
  <CmsEditorForm {contentTypeID} {values} {cms} method={type.form.method} action={type.form.action} previewComponent={type.form.previewComponent} />
{:catch error}
  Error loading content:
{/await}