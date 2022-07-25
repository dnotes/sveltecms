<script lang="ts">

import type SvelteCMS from "sveltecms";
import type { Content, Value } from "sveltecms/core/ContentStore";
import { Display } from "sveltecms/core/Display";
import type { Field } from "sveltecms/core/Field";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:Value
  export let parent:Content
  export let displayMode:string = undefined

  let items:Value[]
  let display:Display

  $: items = Array.isArray(item) ? item : [item]
  $: display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? false, cms)

</script>


{#if display.isDisplayed}

  {#each items as item}
    {#if display.component}
      <svelte:component this={display.component.component} {cms} {item} {entity} {parent} {displayMode} />
    {:else}
      <svelte:element
        this={display.tag}
        id={display.id}
        class="field-{entity.id} field-type-{entity.type} {display.classList}"
      >
        {#if entity.displayComponent}
          <svelte:component this={entity.displayComponent.component} {cms} {item} {entity} {parent} {displayMode} />
        {:else if display?.html}
          {@html item}
        {:else if display?.link}
          <a href="{cms.getUrl(parent)}">{item}</a>
        {:else}
          {item}
        {/if}
      </svelte:element>
    {/if}
  {/each}

{/if}