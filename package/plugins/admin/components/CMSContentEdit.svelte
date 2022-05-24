<script>import CmsEditorForm from 'sveltecms/CMSEditorForm.svelte';
// @ts-ignore
import { goto } from '$app/navigation';
import { browser } from '$app/env';
export let cms;
export let basePath;
export let adminPath;
export let data;
let [contentPath, contentTypeID, slug] = adminPath.split('/');
// If new content was just posted, goto the new url
let isNew = slug === '_';
if (browser && isNew && data._slug)
    goto(`${basePath}/${contentPath}/${contentTypeID}/${data._slug}`);
let content = data ?? cms.getContent(contentTypeID, slug, { getRaw: true });
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
