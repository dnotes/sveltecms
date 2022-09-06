<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import ContentItem from 'sveltecms/display/ContentItem.svelte';

  export let cms:SvelteCMS
  export let entity:Field
  export let item:Content

  $: contentType = cms.contentTypes[item._type] || { ...cms.defaultContentType, id:item._type }

</script>

<ContentItem {cms} entity={contentType} {item} displayMode="{entity?.widget?.options?.displayMode?.toString() || 'reference'}" />
