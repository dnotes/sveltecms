<script lang="ts">
import type SvelteCMS from 'sveltecms';
import type { WidgetField } from 'sveltecms'
import type { Content } from 'sveltecms/core/ContentStore';
import Tags from 'svelte-tags-input'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    allowPaste?:boolean
    allowDrop?:boolean
    splitWith?:string
    allowBlur?:boolean
    onlyUnique?:boolean
    placeholder?:string
    items?:Array<string|number|Content> // autoComplete
    restrictToItems?:boolean // onlyAutocomplete
    itemsKey?:string
    itemsFilter?:boolean
    minChars?:number
  } = field.widget.options

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
    allowPaste={opts.allowPaste}
    allowDrop={opts.allowDrop}
    splitWith={opts.splitWith}
    maxTags={field.multiple ? (field.multipleMax || false) : 1}
    allowBlur={opts.allowBlur}
    onlyUnique={opts.onlyUnique}
    autoComplete={opts.items}
    onlyAutocomplete={opts.restrictToItems}
    autoCompleteKey={opts.itemsKey}
    autoCompleteFilter={opts.itemsFilter}
    minChars={opts.minChars}
    labelText={field.label}
  />
</label>
