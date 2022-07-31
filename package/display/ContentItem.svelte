<script>import Display from "sveltecms/core/Display";
import FieldList from "./FieldList.svelte";
export let cms;
export let entity = undefined;
export let item;
export let displayMode;
let classes = undefined;
export { classes as class };
$: display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'div', cms);
$: classes = classes || `content-type-${entity.id} display-mode-${displayMode}`;
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
