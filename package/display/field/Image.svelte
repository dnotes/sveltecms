<script>import Display from "sveltecms/core/Display";
import FieldList from "../FieldList.svelte";
export let cms;
export let entity;
export let item;
export let displayMode;
$: src = typeof item === 'string' ? item : item.src;
$: alt = item?.['alt'] || undefined;
$: title = item?.['title'] || undefined;
$: display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'div', cms);
</script>

{#if src}

  <svelte:element
    this={display.tag}
    id={display.id}
    class="{display.classList}"
  >

    <img {src} {alt} {title} />

    {#if typeof item !== 'string' && entity.fields}
      <FieldList {cms} {entity} {item} {displayMode} />
    {/if}

  </svelte:element>

{/if}