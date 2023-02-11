<script lang="ts">
import type SvelteCMS from "sveltecms";
import type Field from "sveltecms/core/Field";
import type { Media } from "sveltecms/core/MediaStore";
import FieldList from "../FieldList.svelte";

  export let cms:SvelteCMS
  export let entity:Field
  export let item:string|Media
  export let displayMode:string

  let filepath = typeof item === 'string' ? item : item.src
  $: filepath = typeof item === 'string' ? item : item.src

  let filename = item?.['_meta']?.name ?? filepath?.replace(/.+\//,'')
  $: filename = item?.['_meta']?.name ?? filepath?.replace(/.+\//,'')

</script>

{#if filepath}

  <a href="{filepath}">{filename}</a>
  {#if item?.['_meta']?.type?.startsWith('audio/')}
    <audio controls src="{filepath}" />
  {/if}

  {#if typeof item !== 'string' && entity.fields}
    <FieldList {cms} {entity} {item} {displayMode} />
  {/if}

{/if}