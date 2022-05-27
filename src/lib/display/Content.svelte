<script lang="ts">
import type { FieldableEntity, FieldableEntityConfigSetting } from "sveltecms";

import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { FieldConfigSetting } from "sveltecms/core/Field";

import Field from 'sveltecms/display/Field.svelte'
import Wrapper from "./Wrapper.svelte";

  export let cms:SvelteCMS
  export let entity:FieldableEntity|FieldableEntityConfigSetting|FieldConfigSetting = undefined
  export let contentTypeID:string = undefined
  export let content:Content
  $: entity = typeof contentTypeID === 'string' ? cms.getContentType(contentTypeID) : entity
  $: fields = Object.entries(entity?.fields || {})

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
