<script>import ContentItem from '../ContentItem.svelte';
  export let cms;
  export let entity;
  export let item;
  $: contentType = cms.contentTypes?.[item?._type] || { ...cms.defaultContentType, id: item?._type };
  </script>

  {#if item && contentType}<ContentItem {cms} entity={contentType} {item} displayMode="{entity?.widget?.options?.displayMode?.toString() || 'reference'}" />{/if}