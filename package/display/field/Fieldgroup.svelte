<script>import Content from 'sveltecms/display/Content.svelte';
import Fieldgroup from "sveltecms/core/Fieldgroup";
export let cms;
export let field;
export let value;
$: fieldgroup = value?._fieldgroup || false;
$: entity = fieldgroup ?
    new Fieldgroup(fieldgroup, cms) :
    field;
</script>

<div>
  <Content {cms} {entity} content={value}><slot></slot></Content>
</div>