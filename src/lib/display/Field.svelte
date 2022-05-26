<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { ComponentType } from "sveltecms/core/Component";
import type Component from "sveltecms/core/Component";
import type { Field, FieldConfigSetting } from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let field:Field|FieldConfigSetting
  export let component:Component|ComponentType
  export let value

</script>

{#if component?.component}
  <svelte:component this={component.component} {cms} {field} {value}><slot></slot></svelte:component>
{:else}
  <!-- Missing component for display -->
{/if}