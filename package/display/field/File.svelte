<script>import Display from "sveltecms/core/Display";
import FieldList from "../FieldList.svelte";
export let cms;
export let entity;
export let item;
export let displayMode;
$: filepath = typeof item === 'string' ? item : item.src;
$: filename = filepath.replace(/.+\//, '');
$: display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms);
</script>

{#if filepath}

  <svelte:element
    this={display.tag}
    id={display.id}
    class="{display.classList}"
  >

    <a href="{filepath}">{filename}</a>

    {#if typeof item !== 'string' && entity.fields}
      <FieldList {cms} {entity} {item} {displayMode} />
    {/if}

  </svelte:element>

{/if}