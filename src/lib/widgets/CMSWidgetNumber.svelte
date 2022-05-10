<script lang="ts">
import type { WidgetField } from "..";

  export let field:WidgetField
  export let id:string

  export let value = field.default

  //@ts-ignore
  let opts:{min?:number,max?:number,step?:number} = field.widget.options

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input
    name="{id}"
    type="number"
    title="{field.tooltip}"
    bind:value
    min={opts?.min}
    max={opts?.max}
    step={opts?.step}
    disabled={field.disabled}
    required={field.required}
  />
</label>
