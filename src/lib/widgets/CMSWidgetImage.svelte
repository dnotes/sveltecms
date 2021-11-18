<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

  let files

  //@ts-ignore
  let opts:{} = field.widget.options

</script>

<label>
  <span>
    <slot>{field.title}</slot>
  </span>
  <input
    name={id}
    title={field.description}
    type="file"
    bind:files={value}
    multiple={field.multiple}
    disabled={field.disabled}
    required={field.required}
  />

</label>