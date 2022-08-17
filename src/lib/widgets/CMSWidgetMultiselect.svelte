<script lang="ts">
import type { WidgetField } from 'sveltecms'
import Tags from 'svelte-tags-input'
import { getList } from 'sveltecms/utils';

  export let field:WidgetField
  export let id:string

  export let value:string|number|Array<string|number> = field.default

  function handleTags(e) {
    if (!field.multiple || (field.multipleOrSingle && e.detail?.tags?.length === 1)) value = typeof tags?.[0] === 'string' ? tags[0] : tags?.[0]?.value
    else value = e.detail?.tags?.length ? tags.map(t => typeof t === 'string' ? t : t.value) : undefined
  }

  let opts:{
    items?:string[]|any // autoComplete
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

  let autoComplete = getList(opts.items)

  let tags:Array<string|{value:any,label:any}> = Array.isArray(value)
    ? value.map(v => v.toString()).map(v => autoComplete.find(item => item.value === v) ?? v)
    : ((typeof value === 'undefined' || value === '' || value === null)
      ? []
      : [(autoComplete.find(item => item.value === value) ?? value.toString())]
    )

  // For script functions
  $: opts = field.widget.options ?? {}
  $: autoComplete = getList(opts.items)

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
    bind:autoComplete
    autoCompleteKey='label'
    onlyAutocomplete={opts.restrictToItems}
    autoCompleteFilter={!opts.itemsFilter ? false : undefined}
    minChars={opts.minChars.toString()}
    labelText={field.label}
  />
</label>
{#each tags as tag}
  <input type="hidden" name="{id}" value="{typeof tag === 'string' ? tag : tag.value}" />
{/each}