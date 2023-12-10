<script>import FieldList from "../FieldList.svelte";
export let cms;
export let entity;
export let item;
export let displayMode;
let filepath = typeof item === 'string' ? item : item.src;
$: filepath = typeof item === 'string' ? item : item.src;
let filename = item?.['_meta']?.name ?? filepath?.replace(/.+\//, '');
$: filename = item?.['_meta']?.name ?? filepath?.replace(/.+\//, '');
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