<script lang="ts">
import type SvelteCMS from 'sveltecms';

import type { WidgetField } from 'sveltecms'
import type ContentType from 'sveltecms/core/ContentType';
import Tags from 'svelte-tags-input'
import { onMount } from 'svelte';
import type { Content } from 'sveltecms/core/ContentStore';

  export let cms:SvelteCMS
  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    contentType:string
    searchField:string[]
    twoWayLinkField?:string
    allowNewContent?:boolean
    slugOnly?:boolean
    placeholder?:string
    minChars?:number
    allowBlur?:boolean
  } = field.widget.options ?? {}

  let autoComplete

  onMount(() => {
    autoComplete = async (value) => {
      return cms.listContent(opts.contentType, value)
    }
  })

</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <Tags
    bind:tags={value}
    name={id}
    disable={field.disabled}
    placeholder={opts.placeholder}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    onlyUnique
    {autoComplete}
    autoCompleteKey={opts.searchField}
    onlyAutocomplete={opts.allowNewContent ? false : true}
    allowBlur={opts.allowBlur}
    minChars={opts.minChars}
    labelText={field.label}
  />
</label>
