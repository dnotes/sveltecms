<script lang="ts">
import type SvelteCMS from "sveltecms";
import Display from "sveltecms/core/Display";
import type Field from "sveltecms/core/Field";
import type { Media } from "sveltecms/core/MediaStore";
import FieldList from "../FieldList.svelte";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:string|Media
  export let displayMode:string

  $: src = typeof item === 'string' ? item : item.src
  $: alt = item?.['alt'] || undefined
  $: title = item?.['title'] || undefined
  $: display = new Display(entity?.displays?.[displayMode] ?? entity?.displays?.['default'], cms)

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