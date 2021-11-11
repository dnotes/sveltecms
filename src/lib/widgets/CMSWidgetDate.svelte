<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.default

</script>

<label>
  <span>
    <slot>{field.title}</slot>
  </span>
  <input
    name={id}
    title={field.description}
    type="date"
    bind:value
    disabled={field.disabled}
    required={field.required}
  />
</label>
