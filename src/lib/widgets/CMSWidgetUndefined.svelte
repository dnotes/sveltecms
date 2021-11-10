<script lang="ts">
import type { SvelteCMSContentField } from "$lib"

  export let field:SvelteCMSContentField
  export let id

</script>

<div>
  <p>No widget was found for {field.title}.</p>
  <ul>
    <li>path: <code>{id}</code></li>
    <li>field type: <code>{field.type}</code></li>
  </ul>
</div>
