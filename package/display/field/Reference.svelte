<script>import ContentItem from 'sveltecms/display/ContentItem.svelte';
export let cms;
export let entity;
export let item;
$: contentType = cms.contentTypes[item._type] || { ...cms.defaultContentType, id: item._type };
</script>

<ContentItem {cms} entity={contentType} {item} displayMode="{entity?.widget?.options?.displayMode?.toString() || 'reference'}" />
