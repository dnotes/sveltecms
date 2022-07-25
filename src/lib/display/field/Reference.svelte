<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import ContentItem from 'sveltecms/display/ContentItem.svelte';

  export let cms:SvelteCMS
  export let entity:Field
  export let item:Content|string

  $: contentTypeID = typeof item === 'string' ? item.replace(/\/.+/,'') : item._type
  $: contentType = cms.getContentType(contentTypeID)
  $: content = typeof item === 'string' ? cms.getContent(contentType, item) : item

</script>

{#await content then content}
  <ContentItem {cms} entity={contentType} item={content} displayMode="{entity?.widget?.options?.displayMode?.toString() || 'reference'}" />
{/await}
