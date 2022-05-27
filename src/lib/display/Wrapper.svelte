<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { DisplayConfig } from "sveltecms/core/Display";

  export let cms:SvelteCMS
  export let display:DisplayConfig

</script>

{#if display.isComponent}
  <svelte:component this={cms.components[display.type].component}><slot></slot></svelte:component>
{:else}
  <svelte:element this={display.type}><slot></slot></svelte:element>
{/if}