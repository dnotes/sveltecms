<script lang="ts">
import type SvelteCMS from 'sveltecms';

  export let cms:SvelteCMS
  export let adminPath:string

  $: [section, id] = adminPath.split('/')
  $: item = cms[section][id] || { id }

</script>
