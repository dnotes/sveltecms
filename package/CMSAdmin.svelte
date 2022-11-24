<script>import getLabelFromID from "./utils/getLabelFromID";
import Nav from "./ui/Nav.svelte";
export let cms;
export let adminPath;
export let url;
export let data = undefined;
$: sections = Object.values(cms.adminPages)
    .filter(o => !o.id.match('/'));
let adminPage;
let adminPagePromise;
$: basePath = url.pathname.replace('/' + adminPath, '');
$: if (adminPath)
    adminPagePromise = (async () => { adminPage = cms.getAdminPage(adminPath); })();
$: title = adminPage ? adminPath.split('/').map((t, i) => adminPage.label[i] || getLabelFromID(t)).join(' : ') : 'Site Admin';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="sveltecms">

<Nav {cms} {adminPath} {basePath} />

<div class="cms-admin">

<h1>{title}</h1>

{#await adminPagePromise then}
  {#if adminPage}
    <svelte:component
      this={adminPage.component.component}
      {cms}
      {adminPath}
      {adminPage}
      {basePath}
      {data}
      {url}
      options={adminPage?.component?.options || {}}
    />
  {:else}
    <ul>
      {#each sections as section}
        <li>
          <a href="{basePath}/{section.id}">{section.label || getLabelFromID(section.id)}</a>
        </li>
      {:else}
        Can't find any admin sections! If you are not using the default administrative interface ('sveltecms/CMSAdmin.svelte'), did you remember to <code>cms.use(adminPlugin)</code>?
      {/each}
    </ul>
  {/if}
{/await}

</div>
</div>
