<script lang="ts">
import type SvelteCMS from "sveltecms";
import type { Value } from "sveltecms/core/ContentStore";
import Display from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";
import FieldList from "../FieldList.svelte";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:string|{
    src:string,
    [key:string]:Value
  }
  export let displayMode:string

  $: filepath = typeof item === 'string' ? item : item.src
  $: filename = filepath.replace(/.+\//,'')
  $: display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'div', cms)

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