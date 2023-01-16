<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Content, Value } from "sveltecms/core/ContentStore";
import type ContentType from "sveltecms/core/ContentType";

import type { Display } from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";
import type Fieldgroup from "./field/Fieldgroup.svelte";
  export let cms:SvelteCMS
  export let entity:ContentType|Field|Fieldgroup
  export let item:Content|Value|undefined = undefined
  export let parent:Content|Value|undefined = undefined
  export let displayMode:string
  export let display:Display
  let classes:string = ''
  export { classes as class }
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