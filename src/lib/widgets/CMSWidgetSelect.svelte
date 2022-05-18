<script lang="ts">
import type { WidgetField } from "..";

  export let field:WidgetField
  export let id:string

  export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '')

  //@ts-ignore
  let opts:{size:number, items:string[]|{[key:string|number]:string}} = field.widget.options

  $: options = Array.isArray(opts.items) ? Object.fromEntries(opts.items.map(o => { return [o,o] })) : opts.items

</script>

{#if field.multiple}
  <label>
    <span>
      <slot>{field.label}</slot>
    </span>
    <select
      name={id}
      title={field.helptext}
      bind:value
      size={opts?.size || 0}
      multiple
      disabled={field.disabled}
      required={field.required}
    >
      {#each Object.entries(options || {}) as [value,title]}
        <option {value}>{title}</option>
      {/each}
    </select>
  </label>
{:else}
  <label>
    <span>
      <slot>{field.label}</slot>
    </span>
    <select
      name={id}
      title={field.helptext}
      bind:value
      size={opts.size || 0}
      disabled={field.disabled}
      required={field.required}
    >
      {#each Object.entries(options || {}) as [value,title]}
        <option {value}>{title}</option>
      {/each}
    </select>
  </label>
{/if}
