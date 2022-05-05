<script lang="ts">
import type SvelteCMS from "sveltecms"
// @ts-ignore TODO: why can't it find this?
import { page } from '$app/stores'
import getLabelFromID from "./utils/getLabelFromID";

  export let cms:SvelteCMS
  export let adminPath:string
  export let data:Object = undefined

  let sections = Object.values(cms.adminPages)
    .filter(o => !o.id.match('/'))

  $: basePath = $page.url.pathname.replace('/' + adminPath, '')
  $: adminPage = cms.getAdminPage(adminPath)
  $: title = adminPage ? adminPage.title ?? getLabelFromID(adminPath.replace(/\/.+/, '')) : 'Site Admin'
  $: crumbs = adminPath.split('/').reduce((agg,val,i,arr) => {
    if (i<arr.length-1) {
      let base = agg.length ? agg[agg.length-1][1] : ''
      agg.push([val, `${base}/${val}`])
    }
    return agg
  }, [['admin', '']])

</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<nav>
  {#each sections as section}
    <a href="{basePath}/{section.id}">{section.title || getLabelFromID(section.id)}</a>
  {/each}
</nav>
<div class="breadcrumbs">
  &nbsp;
  {#each crumbs as [name, path], i}
    <a href="{basePath}{path}"> &ltri; {name}</a>
  {/each}
</div>


<h1>{title}</h1>

{#if adminPage}
  <svelte:component this={adminPage.component} {cms} {adminPath} {adminPage} {basePath} {data} />
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

<style>
  h1 { margin:10px 0; }
  nav { position:fixed; top:0; left:0; padding:4px 0; width:100%; background:lightgray; }
  nav>a { padding:2px 10px; display:inline-block; text-align:center; vertical-align:middle; }
  .breadcrumbs { margin-top:2em; }
  .breadcrumbs a { font-size:12px; font-weight:normal; display:inline-block; padding-left: 8px; vertical-align:middle; text-decoration:none; }
</style>