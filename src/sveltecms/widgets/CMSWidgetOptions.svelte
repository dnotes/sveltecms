<script lang="ts">
import { getList } from "sveltecms/utils/list";

import type { WidgetField } from "..";

  export let field:WidgetField
  export let id:string

  export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '')

  //@ts-ignore
  let opts:{
    items?:string[]|any
    oneline?:boolean
    labelBeforeCheckbox?:boolean
  } = field.widget.options

  let options = getList(opts.items)

  $: opts = field.widget.options
  $: options = getList(opts.items)

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input type="checkbox" style="display:none" />
  {#each options as o}
    <label class:oneline={opts.oneline}>

      {#if opts.labelBeforeCheckbox}
        <span>{o.label}</span>
      {/if}

      {#if field.multiple}
        <input
          name="{id}"
          title={o.value}
          type="checkbox"
          disabled={field.disabled}
          required={field.required}
          value={o.value}
          bind:group={value}
        />
      {:else}
        <input
          name="{id}"
          title="{o.value}"
          type="radio"
          value={o.value}
          disabled={field.disabled}
          required={field.required}
          bind:group={value}
        >
      {/if}

      {#if !opts.labelBeforeCheckbox}
        <span>{o.label}</span>
      {/if}

    </label>
  {/each}
</label>

<style>
  label label { display:block; }
  label label.oneline { display:inline; margin-right:.6em; }
</style>