<script lang="ts">
import type SvelteCMS from "sveltecms"
// @ts-ignore TODO: why can't it find this?
import { page } from '$app/stores'
import getLabelFromID from "./utils/getLabelFromID";

  export let cms:SvelteCMS
  export let adminPath:string
  export let data:Object = undefined

  let basePath = $page.url.pathname.replace('/' + adminPath, '')

  let sections = Object.values(cms.adminPages)
    .filter(o => !o.id.match('/'))

  $: adminPage = cms.getAdminPage(adminPath)
  $: title = adminPage ? adminPage.title ?? getLabelFromID(adminPath.replace(/\/.+/, '')) : 'Site Admin'

</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

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
