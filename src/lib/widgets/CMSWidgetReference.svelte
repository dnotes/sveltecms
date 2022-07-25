<script lang="ts">
import type SvelteCMS from 'sveltecms';
import Fuse from 'fuse.js'

import type { WidgetField } from 'sveltecms'
import Tags from 'svelte-tags-input'
import { onMount } from 'svelte';

  export let cms:SvelteCMS
  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    contentTypes:string|string[]
    inputField:string
    twoWayLinkField?:string
    allowNewContent?:boolean
    slugOnly?:boolean
    placeholder?:string
    minChars?:number
    allowBlur?:boolean
  } = field.widget.options ?? {}

  let autoComplete

  onMount(async () => {
    autoComplete = async (value) => {
      let content = await cms.listContent(opts.contentTypes, value)
      return content
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
    disable={field.disabled}
    placeholder={opts.placeholder}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    onlyUnique
    {autoComplete}
    autocompleteFilter={false}
    autoCompleteKey={opts.inputField || '_slug'}
    onlyAutocomplete={opts.allowNewContent ? false : true}
    allowBlur={opts.allowBlur}
    minChars={opts.minChars}
    labelText={field.label}
  />
  {#each value as item}
    <input type="hidden" name="{id}" value="{item?._slug ? `${item._type}/${item._slug}` : item}" />
  {/each}
</label>
