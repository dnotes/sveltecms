<script lang="ts">
import type { SvelteCMSContentField } from "..";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{placeholder?:string} = field.widget.options

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input
    name={id}
    title={field.tooltip}
    type="text"
    bind:value
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
  />
</label>
