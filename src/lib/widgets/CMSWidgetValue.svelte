<script lang="ts">
import type { WidgetField } from 'sveltecms'

  export let field:WidgetField
  export let id:string

  export let value = field.default

</script>

<input
  name={id}
  type="hidden"
  bind:value
/>
