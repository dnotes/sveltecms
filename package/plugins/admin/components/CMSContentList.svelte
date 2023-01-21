<script>import Button from "../../../ui/Button.svelte";
import PowerTable from '../../../ui/PowerTable.svelte';
import { goto } from "$app/navigation";
export let adminPath;
export let basePath;
export let data = [];
export let cms;
let [contentPath, contentTypeID, slug] = adminPath.split('/');
let contentType = cms.getEntity('contentType', contentTypeID);
const ptOptions = {
    footerText: false,
    footerFilters: false,
};
</script>

<Button primary href="{basePath}/{adminPath}/_">+ add</Button>

{#if Array.isArray(data)}
  <div>
    <PowerTable {cms} entity={contentType} {ptOptions} ptData={data} on:rowClicked={(e) => goto(`/admin/content/${e.detail.data._type}/${e.detail.data._slug}`)} />
  </div>
{/if}

<style></style>