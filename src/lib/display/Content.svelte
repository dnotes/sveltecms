<script lang="ts">
import type { FieldableEntity, FieldableEntityConfigSetting } from "sveltecms";

import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { FieldConfigSetting } from "sveltecms/core/Field";

import Field from 'sveltecms/display/Field.svelte'

  export let cms:SvelteCMS
  export let entity:FieldableEntity|FieldableEntityConfigSetting|FieldConfigSetting = undefined
  export let contentTypeID:string = undefined
  export let content:Content
  $: entity = typeof contentTypeID === 'string' ? cms.getContentType(contentTypeID) : entity
  $: fields = Object.entries(entity?.fields || {})

</script>

{#each fields as [id, field], i}
  {#if field.display && content[id] && (!Array.isArray(content[id]) || content[id]?.['length'])}
    {#if field.display?.['wrapper']}

      <Field
        {cms}
        value={content[id]}
        component={cms.getDisplayComponent(field.display)}
        {field}>

        {#if Array.isArray(content[id])}

          {#each content[id] as value}

            <Field
              {cms}
              {value}
              component={cms.getDisplayComponent(field.display)}
              {field}/>

          {/each}

        {:else}

          <Field
            {cms}
            value={content[id]}
            component={cms.getDisplayComponent(field.display)}
            {field}/>

        {/if}

      </Field>

    {:else}

      {#if Array.isArray(content[id])}

        {#each content[id] as value}

          <Field
            {cms}
            {value}
            component={cms.getDisplayComponent(field.display)}
            {field}/>

        {/each}

      {:else}

        <Field
          {cms}
          value={content[id]}
          component={cms.getDisplayComponent(field.display)}
          {field}/>

      {/if}

    {/if}

  {/if}

{/each}
