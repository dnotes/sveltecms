<script lang="ts">
import type { CMSWidgetField } from "..";

  export let field:CMSWidgetField
  export let id:string

  export let value = field.default

  let files

  //@ts-ignore
  let opts:{} = field.widget.options

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input
    name={id}
    title={field.tooltip}
    type="file"
    bind:files={value}
    multiple={field.multiple}
    disabled={field.disabled}
    required={field.required}
  />

</label>