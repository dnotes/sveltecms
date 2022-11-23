<script lang="ts">
import type SvelteCMS from 'sveltecms'
import CmsEditorForm from 'sveltecms/CMSEditorForm.svelte'

// import { goto } from '$app/navigation';
// import { isBrowser, isWebWorker, isJsDom } from 'browser-or-node'

  export let cms:SvelteCMS
  export let adminPath:string
  export let data

  let [ contentPath, contentTypeID, slug ] = adminPath.split('/')
  $: ([ contentPath, contentTypeID, slug ] = adminPath.split('/'))

  // If new content was just posted, goto the new url
  let isNew = slug === '_'
  // if (isBrowser && data._slug) {
  //   if (isNew) goto(`${basePath}/${contentPath}/${contentTypeID}/${data._slug}`)
  //   else if (slug !== data._slug) goto(`${basePath}/${contentPath}/${contentTypeID}/${data._slug}`)
  // }

  $: content = data ?? cms.getContent(contentTypeID, slug, { getRaw:true })

</script>

{#await content}
  loading editor...
{:then values}
  <CmsEditorForm {contentTypeID} {values} {cms} {isNew} />
{:catch error}
  Error loading content:
  <pre><code>
    {error.message}
    {error.stack}
  </code></pre>
{/await}
