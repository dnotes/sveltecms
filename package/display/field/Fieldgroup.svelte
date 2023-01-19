<script>import Fieldgroup from "../../core/Fieldgroup";
import ContentItem from "../ContentItem.svelte";
export let cms;
export let entity;
export let item;
export let displayMode;
let fieldgroupID = item?._fieldgroup || '';
$: fieldgroupID = item?._fieldgroup || '';
let fieldgroup;
$: fieldgroup = fieldgroupID ? new Fieldgroup(fieldgroupID, cms) : entity;
</script>

{#if fieldgroup}
  <ContentItem {cms} entity={fieldgroup} {item} {displayMode} class="fieldgroup fieldgroup-{fieldgroup.id}" />
{/if}
