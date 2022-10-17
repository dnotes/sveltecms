<script lang="ts">
import type SvelteCMS from "sveltecms"
// @ts-ignore TODO: why can't it find this?
import { page } from '$app/stores'
import getLabelFromID from "./utils/getLabelFromID";
import Nav from "sveltecms/ui/Nav.svelte";
import type { AdminPage } from "./core/AdminPage";

  export let cms:SvelteCMS
  export let adminPath:string
  export let data:Object = undefined

  $: sections = Object.values(cms.adminPages)
    .filter(o => !o.id.match('/'))
  let adminPage:AdminPage
  let adminPagePromise:Promise<void>

  $: basePath = $page.url.pathname.replace('/' + adminPath, '')
  $: if (adminPath) adminPagePromise = (async () => { adminPage = cms.getAdminPage(adminPath); })()
  $: title = adminPage ? adminPath.split('/').map((t,i) => adminPage.label[i] || getLabelFromID(t) ).join(' : ') : 'Site Admin'

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
