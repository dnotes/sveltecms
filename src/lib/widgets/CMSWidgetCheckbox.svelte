<script lang="ts">
import type { WidgetField } from "sveltecms";

  export let field:WidgetField
  export let id:string

  export let value = field.default

  let opts:{labelBeforeCheckbox?:boolean} = field.widget.options

</script>

<label>
  {#if opts?.labelBeforeCheckbox}
    <span>
      <slot>{field.label}</slot>
    </span>
  {/if}
  <input
    name={id}
    title={field.helptext}
    type="checkbox"
    bind:checked={value}
    disabled={field.disabled}
    required={field.required}
  />
  {#if !opts?.labelBeforeCheckbox}
    <span>
      <slot>{field.label}</slot>
    </span>
  {/if}
</label>
