<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{
    falseText?:string
    trueText?:string
    fontSize?:number
    labelBeforeCheckbox?:boolean
  } = field.widget.options

  function toggle() { if (!field.disabled) value = !value }

</script>

<label>
  <input
    type="hidden"
    name={id}
    bind:value
    required={field.required}
  >
  {#if opts?.labelBeforeCheckbox}
    <span on:click={toggle}>{field.label}</span>
  {/if}
  <i style:font-size="{opts?.fontSize ?? 100}%" on:click={toggle}>
    {#if value}
      {opts?.trueText || ''}
    {:else}
      {opts?.falseText || ''}
    {/if}
  </i>
  {#if !opts?.labelBeforeCheckbox}
    <span on:click={toggle}>{field.label}</span>
  {/if}
</label>

<style>
  i { display:inline-block; font-style:normal; line-height:inherit; }
</style>