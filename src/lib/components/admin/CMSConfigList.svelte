<script lang="ts">
import type SvelteCMS from "../..";

  export let cms:SvelteCMS
  export let adminPath:string

  $: [key] = adminPath.split('/')
  $: items = Object.entries(cms[key])

</script>

<ul>

</ul>
