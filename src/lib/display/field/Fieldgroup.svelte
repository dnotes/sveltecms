<script lang="ts">
import type SvelteCMS from "sveltecms";
import ContentItem from 'sveltecms/display/ContentItem.svelte';
import Fieldgroup from "sveltecms/core/Fieldgroup";
import type { FieldableEntity } from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";

  export let cms:SvelteCMS
  export let entity:FieldableEntity
  export let item:Content & { _fieldgroup?:string }

  let fieldgroupID:string
  $: fieldgroupID = item?._fieldgroup || ''
  $: fieldgroup = fieldgroupID ?
              new Fieldgroup(fieldgroupID, cms) :
              entity

</script>

<div>
  <ContentItem {cms} entity={fieldgroup} {item}><slot></slot></ContentItem>
</div>