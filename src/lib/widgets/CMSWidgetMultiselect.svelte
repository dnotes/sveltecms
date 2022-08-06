<script lang="ts">
import type { WidgetField } from 'sveltecms'
import type { Content } from 'sveltecms/core/ContentStore';
import Tags from 'svelte-tags-input'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  let tags = Array.isArray(value) ? value : (
    typeof value === 'undefined' || value === '' || value === null ? [] : [value]
  )

  function handleTags(e) {
    if (!field.multiple || (field.multipleOrSingle && e.detail?.tags?.length === 1)) value = tags[0]
    else value = e.detail?.tags?.length ? tags : undefined
  }

  //@ts-ignore
  let opts:{
    items?:Array<string|number|Content> // autoComplete
    restrictToItems?:boolean // onlyAutocomplete
    itemsFilter?:boolean
    placeholder?:string
    onlyUnique?:boolean
    allowBlur?:boolean
    minChars?:number
    allowPaste?:boolean
    allowDrop?:boolean
    splitWith?:string
  } = field.widget.options

</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <Tags
    bind:tags
    on:tags={handleTags}
    disable={field.disabled}
    placeholder={opts.placeholder}
    allowPaste={opts.allowPaste}
    allowDrop={opts.allowDrop}
    splitWith={opts.splitWith}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    allowBlur={opts.allowBlur}
    onlyUnique={opts.onlyUnique}
    autoComplete={opts.items}
    onlyAutocomplete={opts.restrictToItems}
    autoCompleteFilter={!opts.itemsFilter ? false : undefined}
    minChars={opts.minChars}
    labelText={field.label}
  />
</label>
{#each tags as tag}
  <input type="hidden" name="{id}" value="{tag}" />
{/each}