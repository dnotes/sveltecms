<script lang="ts">
import type { DisplayableEntity, EntityType, FieldableEntity } from "sveltecms";

import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import Display from "sveltecms/core/Display";
import FieldList from "./FieldList.svelte";

  export let cms:SvelteCMS
  export let entity:EntityType & FieldableEntity & DisplayableEntity = undefined
  export let item:Content
  export let displayMode:string
  let classes:string = `content-type-${entity.id} display-mode-${displayMode}`
  export { classes as class }

  let display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms)
  $: display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms)

  $: classes = classes || `content-type-${entity.id} display-mode-${displayMode}`

</script>

{#if display?.component}

  {#await display.component.component then component}

    <svelte:component
      this={component}
      {cms}
      {item}
      {entity}
      {displayMode}
    >

      <FieldList {cms} {entity} {item} {displayMode} />

    </svelte:component>

  {/await}

{:else if display?.isDisplayed}

  <svelte:element
    this={display.tag}
    id={display.id}
    class="{classes} {display.classList}"
  >

    <FieldList {cms} {entity} {item} {displayMode} />

  </svelte:element>

{/if}
