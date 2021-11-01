<script lang="ts" context="module">
  export type SvelteCMSFieldOptionsText = {
    placeholder?: ''
  }

</script>

<script lang="ts">
import type { SvelteCMSContentFieldConfig } from "$lib";

  export let opts:SvelteCMSFieldOptionsText = {}
  export let conf:SvelteCMSContentFieldConfig

  export let id
  export let value
  export let disabled=(conf?.disabled ? true : false)
  export let required=(conf?.required ? true : false)

</script>

<label for="{id}">
  <slot>{conf.title}</slot>
  <input
    {id}
    type="text"
    bind:value
    placeholder="{opts.placeholder ?? ''}"
    {disabled}
    {required}
    on:change
    on:blur
    on:focus
    on:keydown
    on:keypress
    on:keyup
  />
</label>
