<script lang="ts">
import { getList } from "sveltecms/utils/list";

import type { WidgetField } from "..";

  export let field:WidgetField
  export let id:string

  export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '')

  //@ts-ignore
  let opts:{
    size?:number,
    unset?:string,
    items?:string[]|any
  } = field.widget.options

  $: opts = field.widget.options
  $: options = getList(opts.items)

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
      {#if !field.required || opts.unset}
        <option value="">{opts.unset || '- none -'}</option>
      {/if}
      {#each options as {value,label}}
        <option {value}>{label}</option>
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
      {#if !field.required || opts.unset}
        <option value="">{opts.unset || '- none -'}</option>
      {/if}
      {#each options as {value,label}}
        <option {value}>{label}</option>
      {/each}
    </select>
  </label>
{/if}
