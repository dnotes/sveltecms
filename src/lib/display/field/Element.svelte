<script lang="ts">
import type { Field,FieldConfigSetting } from "sveltecms/core/Field";

  export let field:Field|FieldConfigSetting
  export let value

</script>

<svelte:element
  this={field?.['display']?.['type'] || field?.['display']}
>{#if field?.['display']?.['html']}{@html value}{:else}{value}{/if}</svelte:element>