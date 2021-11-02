<script lang="ts">
import type { SvelteCMSContentField } from "$lib";

  export let conf:SvelteCMSContentField
  export let id
  export let disabled=(conf?.disabled ? true : false)
  export let required=(conf?.required ? true : false)

  export let value = conf.default

</script>

<label for="{id}">
  <slot>{conf.title}</slot>
  <input
    {id}
    name="{id}"
    title={conf.description}
    type="range"
    bind:value
    min="{conf.options.min}"
    max="{conf.options.max}"
    step="{conf.options.step || 1}"
    {disabled}
    {required}
  />
</label>
