<script>import { getList } from "../utils/list";
export let field;
export let id;
export let value = field.multiple ? (Array.isArray(field.default) ? field.default : [field.default || '']) : (field.default || '');
//@ts-ignore
let opts = field.widget.options;
let options = getList(opts.items);
$: opts = field.widget.options;
$: options = getList(opts.items);
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
        {#if Array.isArray(value)}
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
            title={o.value}
            type="checkbox"
            disabled={field.disabled}
            required={field.required}
            value={o.value}
            on:change={()=>{value = [o.value]}}
          />
        {/if}
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
  label label.oneline { display:inline; margin-right:.6em; }</style>