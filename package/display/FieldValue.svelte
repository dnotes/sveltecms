<script>import { Display } from "../core/Display";
import Wrapper from "./Wrapper.svelte";
export let cms;
export let entity;
export let item;
export let parent;
export let displayMode = undefined;
let items;
let display;
$: items = Array.isArray(item) ? item : [item];
$: display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms);
</script>


{#if display.isDisplayed}

  {#if display.label}
    <Wrapper {cms} {entity} {item} {parent} {displayMode} display={display.label} class="field-label">
      {entity.label}
    </Wrapper>
  {/if}

  {#if display.component}
    {#await display.component.component then component}
      {#if display.multiple}
        <svelte:component this={component} {cms} {item} {entity} {parent} {displayMode}/>
      {:else}
        {#each items as item}
          <svelte:component this={component} {cms} {item} {entity} {parent} {displayMode}>
            {#if entity.displayComponent}
              {#await entity.displayComponent.component then component}
                <svelte:component this={component} {cms} {item} {entity} {parent} {displayMode} />
              {/await}
            {:else if display?.html}
              {@html item}
            {:else if display?.link}
              <a href="{cms.getUrl(parent)}">{item}</a>
            {:else}
              {item}
            {/if}
          </svelte:component>
        {/each}
      {/if}
    {/await}
  {:else}
    {#each items as item}
      <svelte:element
        this={display.tag}
        id={display.id}
        class="field-{entity.id} field-type-{entity.type} {display.classList}"
      >
        {#if entity.displayComponent}
          {#await entity.displayComponent.component then component}
            <svelte:component this={component} {cms} {item} {entity} {parent} {displayMode} />
          {/await}
        {:else if display?.html}
          {@html item}
        {:else if display?.link}
          <a href="{cms.getUrl(parent)}">{item}</a>
        {:else}
          {item}
        {/if}
      </svelte:element>
    {/each}
  {/if}

{/if}