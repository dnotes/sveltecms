<script lang="ts">
import type SvelteCMS from 'sveltecms'
import CmsEditorForm from 'sveltecms/CMSEditorForm.svelte'

// @ts-ignore
import { page } from '$app/stores'

  export let cms:SvelteCMS
  export let data

  // $: console.log({data,cms})

  $: [ contentPath, contentTypeID, slug ] = $page.params.adminPath.split('/')
  $: content = data ?? cms.getContent(contentTypeID, slug, { getRaw:true })

</script>

{#await content}
  loading editor...
{:then values}
  <CmsEditorForm {contentTypeID} {values} {cms} />
{:catch error}
  Error loading content:
  <pre><code>
    {error.message}
    {error.stack}
  </code></pre>
{/await}
