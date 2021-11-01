<script lang="ts">
import type { SvelteCMSContentFieldConfig } from "$lib"

  export let conf:SvelteCMSContentFieldConfig

  export let contentType
  export let id

</script>

<div>
  <p>No widget was found for {conf.title}.</p>
  <ul>
    <li>path: <code>{contentType}.{id}</code></li>
    <li>field type: <code>{conf.type}</code></li>
  </ul>
</div>
