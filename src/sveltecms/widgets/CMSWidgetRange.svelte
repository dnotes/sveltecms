<script lang="ts">
import { sortBy } from "lodash-es";


import { getList } from "sveltecms/utils";

import type { WidgetField } from "..";

  export let field:WidgetField
  export let id:string

  export let value:number = field.default

  let opts:{
    min?:number,
    max?:number,
    step?:number,
    showValue?:boolean,
    showScale?:boolean,
    items?:string[],
  }
  $: opts = field.widget.options
  $: valueAsPct = (value - (opts?.min ?? 0)) / ((opts?.max ?? 10) - (opts?.min ?? 0)) * 100
  $: allItems = getList(opts.items)
      .map(item => {
        let value = parseFloat(item.value)
        return {
          value,
          label: item.label,
        }
      })
      .filter(item => !Number.isNaN(item.value))
  let item = ''
  $: if (allItems.length && typeof value !== 'undefined') {
    let idx = allItems.findIndex(item => item.value > value)
    if (idx === -1) item = allItems[allItems.length - 1].label
    else item = allItems[idx - 1].label
  }

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  {#if opts.showValue}
    <div class="val">
      <span style:left="{valueAsPct}%">{value ?? ''}</span>
    </div>
  {/if}
  <input
    name="{id}"
    type="range"
    title="{field.helptext}"
    bind:value
    min="{opts.min}"
    max="{opts.max}"
    step="{opts.step || 1}"
    disabled={field.disabled}
    required={field.required}
  />
  {#if opts.showScale || allItems?.length}
    <div class="flex">
      <span class:hidden={!opts.showScale}>{opts.min}</span>
      <span class="context">{item}</span>
      <span class:hidden={!opts.showScale}>{opts.max}</span>
    </div>
  {/if}
</label>

<style>
  input {
    width: 100%;
  }
  div {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 1em;
  }
  div > span {
    border-radius: 8px;
    flex-grow: 0;
    padding: 2px;
    opacity: .5;
    font-size: 80%;
  }
  div > span.context {
    flex-grow: 1;
    text-align: center;
  }
  div.val {
    position: relative;
    margin: 0 .5em;
    height: 1.5em;
  }
  div.val span {
    position: absolute;
    min-width: 1em;
    transform:translateX(-50%);
  }
  span.hidden { display:none; }
</style>