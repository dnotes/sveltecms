<script lang="ts">
import type { WidgetField } from "..";
import { onMount } from "svelte";

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    placeholder?:string,
    rows?:number,
    cols?:number,
    resize?:'none'|'both'|'horizontal'|'vertical',
    autosize?:boolean
  } = field.widget.options

  let styles = [
    'height:auto'
  ]
  if (opts.autosize) styles.push('overflow:hidden')
  if (opts.resize) styles.push(`resize:${opts.resize}`)

  let el
  onMount(() => {
    autosize()
  })
  function autosize() {
    if (opts.autosize) {
      el.style.height="auto"
      el.style.height=(el.scrollHeight + 2) + 'px'
    }
  }

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <textarea
    name={id}
    title={field.helptext}
    bind:value
    bind:this={el}
    on:input={autosize}
    rows="{opts?.rows ?? undefined}"
    cols="{opts?.cols ?? undefined}"
    placeholder="{opts?.placeholder ?? ''}"
    disabled={field.disabled}
    required={field.required}
    style="{styles.join(';')}"
  />
</label>
