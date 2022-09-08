<script>import ContentItem from '../ContentItem.svelte';
import Fieldgroup from "../../core/Fieldgroup";
export let cms;
export let entity;
export let item;
export let displayMode;
let fieldgroupID;
let fieldgroup;
$: fieldgroupID = item?._fieldgroup || '';
$: fieldgroup = fieldgroupID ?
    new Fieldgroup(fieldgroupID, cms) :
    entity;
</script>

<ContentItem {cms} entity={fieldgroup} {item} {displayMode} class="fieldgroup fieldgroup-{fieldgroup.id}" />
