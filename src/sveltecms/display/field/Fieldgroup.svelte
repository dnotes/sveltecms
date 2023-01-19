<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type Field from "sveltecms/core/Field";
import Fieldgroup from "sveltecms/core/Fieldgroup";
import ContentItem from "sveltecms/display/ContentItem.svelte";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:Content & { _fieldgroup?:string }
  export let displayMode:string

  let fieldgroupID:string = item?._fieldgroup || ''
  $: fieldgroupID = item?._fieldgroup || ''

  let fieldgroup:Field|Fieldgroup
  $: fieldgroup = fieldgroupID ? new Fieldgroup(fieldgroupID, cms) : entity

</script>

{#if fieldgroup}
  <ContentItem {cms} entity={fieldgroup} {item} {displayMode} class="fieldgroup fieldgroup-{fieldgroup.id}" />
{/if}
