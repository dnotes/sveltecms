<script lang="ts">
import type SvelteCMS from "../..";

  export let cms:SvelteCMS
  export let adminPath:string

  $: [section, id] = adminPath.split('/')
  $: item = cms[section][id]

</script>

