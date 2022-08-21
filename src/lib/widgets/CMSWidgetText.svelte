<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    placeholder?:string
    size?:number
  } = field.widget.options

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input
    name={id}
    title={field.helptext}
    type="text"
    bind:value
    placeholder="{opts?.placeholder ?? ''}"
    size={opts.size}
    disabled={field.disabled}
    required={field.required}
  />
</label>
