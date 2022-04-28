<script>import getLabelFromID from "sveltecms/utils/getLabelFromID";
import Grid from 'gridjs-svelte';
import { html } from 'gridjs';
export let cms;
export let adminPath;
$: [contentPath, contentTypeID, slug] = adminPath.split('/');
$: contentType = cms.getContentType(contentTypeID);
$: content = contentTypeID
    ? cms.listContent(contentTypeID).then(data => {
        return data.map(item => ({
            title: html(`<a href="/${contentPath}/${contentTypeID}/${item._slug}>${contentType.slug.fields.map(k => item[k] || '').filter(Boolean).join(' / ')}</a>`),
            ...item,
        }));
    })
    : Object.keys(cms.types).map(id => ({
        name: html(`<a href="/${contentPath}/${id}">${cms.types[id].label || getLabelFromID(id)}</a>`),
        fields: Object.keys(cms.types[id].fields).join(', '),
    }));
</script>

<!-- <Grid data={content} /> -->

<style global>
  @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>