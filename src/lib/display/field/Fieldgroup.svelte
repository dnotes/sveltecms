<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import Content from 'sveltecms/display/Content.svelte';
import Fieldgroup from "sveltecms/core/Fieldgroup";

  export let cms:SvelteCMS
  export let field:Field|FieldConfigSetting
  export let value

  $: fieldgroup = value?._fieldgroup || false
  $: entity = fieldgroup ?
              new Fieldgroup(fieldgroup, cms) :
              field

</script>

<div>
  <Content {cms} {entity} content={value}><slot></slot></Content>
</div>