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
    alt?:string,
    title?:string
  }
  export let displayMode:string

  let src = typeof item === 'string' ? item : item.src
  let alt = item?.['alt'] || undefined
  let title = item?.['title'] || undefined
  let display = new Display(entity?.displayModes?.[displayMode] ?? entity?.display ?? 'div', cms)

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