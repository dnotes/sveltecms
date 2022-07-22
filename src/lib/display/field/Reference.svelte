<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import ContentItem from 'sveltecms/display/ContentItem.svelte';

  export let cms:SvelteCMS
  export let entity:Field|FieldConfigSetting
  export let item:Content|string

  // @ts-ignore
  $: contentTypeID = entity?.widget?.contentType ?? entity?.widget?.options?.contentType
  $: contentType = cms.getEntity('contentType', contentTypeID)
  $: content = typeof item === 'string' ? cms.getContent(contentTypeID, item) : item

</script>

{#await content then content}
  <ContentItem {cms} entity={contentType} item={content}><slot></slot></ContentItem>
{/await}