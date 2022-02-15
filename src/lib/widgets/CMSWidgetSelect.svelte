<script lang="ts">
import type { CMSWidgetField } from "..";

  export let field:CMSWidgetField
  export let id:string

  export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '')

  //@ts-ignore
  let opts:{size:number} = field.widget.options
  // @TODO: <option>s

</script>

{#if field.multiple}
  <label>
    <span>
      <slot>{field.label}</slot>
    </span>
    <select
      name={id}
      title={field.tooltip}
      bind:value
      size={opts?.size || 0}
      multiple
      disabled={field.disabled}
      required={field.required}
    />
  </label>
{:else}
  <label>
    <span>
      <slot>{field.label}</slot>
    </span>
    <select
      name={id}
      title={field.tooltip}
      bind:value
      size={opts.size || 0}
      disabled={field.disabled}
      required={field.required}
    />
  </label>
{/if}
