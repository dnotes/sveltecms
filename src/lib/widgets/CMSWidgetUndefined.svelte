<script lang="ts">
import type { CMSWidgetField } from ".."

  export let field:CMSWidgetField
  export let id

</script>

<div>
  <p>No widget was found for {field.label}.</p>
  <ul>
    <li>path: <code>{id}</code></li>
    <li>field type: <code>{field.type}</code></li>
  </ul>
</div>
