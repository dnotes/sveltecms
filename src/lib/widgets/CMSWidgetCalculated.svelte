<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value

  $: value = field.widget?.options?.value

</script>

<label>
  <span>
    <slot>{field.label}</slot>
  </span>
  <input type="text" disabled bind:value>
  <input
    name={id}
    type="hidden"
    bind:value
  />
</label>
