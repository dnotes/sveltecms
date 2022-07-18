<script lang="ts">
import type { Display } from "sveltecms/core/Display";
  export let display:Display
</script>

{#if display.component}
  <svelte:component this={display.component.component}><slot></slot></svelte:component>
{:else}
  <svelte:element this={display.tag} id={display.id} class="{display.classList}"><slot></slot></svelte:element>
{/if}