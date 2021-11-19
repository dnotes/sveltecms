<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let field:SvelteCMSContentField
  export let id:string

  export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '')

  //@ts-ignore
  let opts:{size:number} = field.widget.options

</script>

{#if field.multiple}
  <label>
    <span>
      <slot>{field.title}</slot>
    </span>
    <select
      name={id}
      title={field.description}
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
      <slot>{field.title}</slot>
    </span>
    <select
      name={id}
      title={field.description}
      bind:value
      size={opts.size || 0}
      disabled={field.disabled}
      required={field.required}
    />
  </label>
{/if}
