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
  let classes:string = undefined
  export { classes as class }

  $: display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'div', cms)
  $: classes = classes || `content-type-${entity.id} display-mode-${displayMode}`

</script>

{#if display?.component}

  <svelte:component
    this={display.component.component}
    {cms}
    {item}
    {entity}
    {displayMode}
  />

{:else if display?.isDisplayed}

  <svelte:element
    this={display.tag}
    id={display.id}
    class="{classes} {display.classList}"
  >

    <FieldList {cms} {entity} {item} {displayMode} />

  </svelte:element>

{/if}
