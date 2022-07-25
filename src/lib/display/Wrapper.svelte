<script lang="ts">
import type { Display } from "sveltecms/core/Display";
  export let display:Display
  let classes:string = ''
  export { classes as class }
</script>

{#if display?.wrapper?.isDisplayed}
  <svelte:self display={display.wrapper} class="{classes}">
    {#if display.component}
      <svelte:component this={display.component.component}><slot></slot></svelte:component>
    {:else}
      <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
    {/if}
  </svelte:self>
{:else}
  {#if display.component}
    <svelte:component this={display.component.component}><slot></slot></svelte:component>
  {:else}
    <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
  {/if}
{/if}