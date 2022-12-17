<script lang="ts">
import Button from "sveltecms/ui/Button.svelte";
import { PowerTable } from '@muonw/powertable';
import { goto } from "$app/navigation";

  export let adminPath:string
  export let basePath:string
  export let data = []

  const ptOptions = {
    footerText:false,
    footerFilters:false,
  }

</script>

<Button primary href="{basePath}/{adminPath}/_">+ add</Button>

{#if Array.isArray(data)}
  <div>
    <PowerTable {ptOptions} ptData={data} on:rowClicked={(e) => goto(`/admin/content/${e.detail.data._type}/${e.detail.data._slug}`)} />
  </div>
{/if}

<style>
  div :global(td) {
    cursor: pointer;
  }
  div :global(button) {
    border: none;
  }
  div :global(th[data-dir="asc"]:after) {
    content: "🔼";
    font-weight: normal;
    opacity: .6;
  }
  div :global(th[data-dir="desc"]:after) {
    content: "🔽";
    font-weight: normal;
    opacity: .6;
  }
  div :global([data-key^="_"]) { display:none; }
</style>