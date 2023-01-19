<script>export let cms;
export let entity;
export let item = undefined;
export let parent = undefined;
export let displayMode;
export let display;
let classes = '';
export { classes as class };
</script>

{#if display?.wrapper?.isDisplayed}
  <svelte:self {cms} {entity} {item} {parent} {displayMode} display={display.wrapper} class="{classes}">
    {#if display.component}
      {#await display.component.component then component}
        <svelte:component {cms} {entity} {item} {parent} {displayMode} {display} this={component}><slot></slot></svelte:component>
      {/await}
    {:else}
      <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
    {/if}
  </svelte:self>
{:else}
  {#if display.component}
    {#await display.component.component then component}
      <svelte:component {cms} {entity} {item} {parent} {displayMode} {display} this={component}><slot></slot></svelte:component>
    {/await}
  {:else}
    <svelte:element this={display.tag} id={display.id} class="{[classes, ...display.classes].join(' ')}"><slot></slot></svelte:element>
  {/if}
{/if}