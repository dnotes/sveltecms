<script>import ContentItem from 'sveltecms/display/ContentItem.svelte';
export let cms;
export let entity;
export let item;
$: contentTypeID = typeof item === 'string' ? item.replace(/\/.+/, '') : item._type;
$: contentType = cms.getContentType(contentTypeID);
$: content = typeof item === 'string' ? cms.getContent(contentType, item) : item;
</script>

{#await content then content}
  <ContentItem {cms} entity={contentType} item={content} displayMode="{entity?.widget?.options?.displayMode?.toString() || 'reference'}" />
{/await}
