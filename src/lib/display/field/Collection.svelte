<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";
import Content from 'sveltecms/display/Content.svelte'

  export let cms:SvelteCMS
  export let field:Field|FieldConfigSetting
  export let value

</script>

<Content {cms} entity={field} content={value}><slot></slot></Content>