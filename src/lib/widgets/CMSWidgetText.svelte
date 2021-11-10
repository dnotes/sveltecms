<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{placeholder?:string} = field.options

</script>

<label>
  <span>
    <slot>{field.title}</slot>
  </span>
  <input
    name={id}
    title={field.description}
    type="text"
    bind:value
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
  />
</label>
