<script lang="ts">
import type { SvelteCMSContentField } from ".."

  export let field:SvelteCMSContentField
  export let id

</script>

<div>
  <p>No widget was found for {field.label}.</p>
  <ul>
    <li>path: <code>{id}</code></li>
    <li>field type: <code>{field.type}</code></li>
  </ul>
</div>
