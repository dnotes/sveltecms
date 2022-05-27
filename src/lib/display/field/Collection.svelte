<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import Content from 'sveltecms/display/Content.svelte';
import Collection from "sveltecms/core/Collection";

  export let cms:SvelteCMS
  export let field:Field|FieldConfigSetting
  export let value

  $: collectionType = value?._collectionType || false
  $: entity = collectionType ?
              new Collection(collectionType, cms) :
              field

</script>

<div>
  <Content {cms} {entity} content={value}><slot></slot></Content>
</div>