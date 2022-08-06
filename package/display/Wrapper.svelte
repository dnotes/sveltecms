<script>export let cms;
export let entity;
export let item;
export let parent;
export let displayMode;
export let display;
let classes = '';
export { classes as class };
</script>

{#if display?.wrapper?.isDisplayed}
  <svelte:self {cms} {entity} {item} {parent} {displayMode} display={display.wrapper} class="{classes}">
    {#if display.component}
      <svelte:component {cms} {entity} {item} {parent} {displayMode} {display} this={display.component.component}><slot></slot></svelte:component>
    {:else}
      <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
    {/if}
  </svelte:self>
{:else}
  {#if display.component}
    <svelte:component {cms} {entity} {item} {parent} {displayMode} {display} this={display.component.component}><slot></slot></svelte:component>
  {:else}
    <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
  {/if}
{/if}