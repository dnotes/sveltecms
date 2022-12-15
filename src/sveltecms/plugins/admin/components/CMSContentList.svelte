<script lang="ts">
import Button from "sveltecms/ui/Button.svelte";
import { PowerTable } from '@muonw/powertable'

  export let adminPath:string
  export let basePath:string
  export let data = []

</script>

<Button primary href="{basePath}/{adminPath}/_">+ add</Button>

{#if Array.isArray(data)}
  <PowerTable ptData={data} />
{/if}