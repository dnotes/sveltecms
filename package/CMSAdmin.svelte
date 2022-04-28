<script>// @ts-ignore TODO: why can't it find this?
import { page } from '$app/stores';
import getLabelFromID from "./utils/getLabelFromID";
import adminPlugin from 'sveltecms/plugins/admin';
export let cms;
cms.use(adminPlugin);
let basePath = $page.url.pathname.replace('/' + $page.params.adminPath, '');
let sections = Object.values(cms.adminPaths)
    .filter(o => !o.id.match('/'));
$: adminPath = cms.getAdminPath($page.params.adminPath);
$: title = adminPath ? adminPath.title ?? getLabelFromID($page.params.adminPath.replace(/\/.+/, '')) : 'Site Admin';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#if adminPath}
  <svelte:component this={adminPath.component} {cms} adminPath={$page.params.adminPath} />
{:else}
  <ul>
    {#each sections as section}
      <li>
        <a href="{basePath}/{section.id}">{section.title || getLabelFromID(section.id)}</a>
      </li>
    {:else}
      Can't find any admin sections! Did you remember to <code>cms.use(adminPlugin)</code>?
    {/each}
  </ul>
{/if}
