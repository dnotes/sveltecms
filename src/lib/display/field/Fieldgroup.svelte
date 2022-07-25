<script lang="ts">
import type SvelteCMS from "sveltecms";
import ContentItem from 'sveltecms/display/ContentItem.svelte';
import Fieldgroup from "sveltecms/core/Fieldgroup";
import type { Content } from "sveltecms/core/ContentStore";
import type Field from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:Content & { _fieldgroup?:string }
  export let displayMode:string

  let fieldgroupID:string
  let fieldgroup:Field|Fieldgroup
  $: fieldgroupID = item?._fieldgroup || ''
  $: fieldgroup = fieldgroupID ?
              new Fieldgroup(fieldgroupID, cms) :
              entity

</script>

<ContentItem {cms} entity={fieldgroup} {item} {displayMode} class="fieldgroup fieldgroup-{fieldgroup.id}" />
