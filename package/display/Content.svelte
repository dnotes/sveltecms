<script>import Field from 'sveltecms/display/Field.svelte';
import Wrapper from "./Wrapper.svelte";
export let cms;
export let entity = undefined;
export let contentTypeID = undefined;
export let content;
$: entity = typeof contentTypeID === 'string' ? cms.getContentType(contentTypeID) : entity;
$: fields = Object.entries(entity?.fields || {});
</script>

{#each fields as [id, field]}
  {#if content[id] && (!Array.isArray(content[id]) || content[id]?.['length'])}
    {#if field?.display?.wrapper}

      <Wrapper {cms} display={field.display.wrapper}>
        <Field
          {cms}
          value={content[id]}
          {field}/>
      </Wrapper>

    {:else if field?.display}

      <Field
        {cms}
        value={content[id]}
        {field}/>

    {/if}
  {/if}
{/each}
