<script lang="ts">
  import type { PageData } from './$types'
  import adminPlugin from 'sveltecms/plugins/admin'
  import cms from '$lib/cms'
  cms.use(adminPlugin)

  // @ts-ignore todo: why doesn't it find this?
  import { page } from '$app/stores'
  import CmsAdmin from 'sveltecms/CMSAdmin.svelte'

  export let data:PageData
  $: adminData = data.data
  $: adminPath = $page.params.adminPath
  $: adminPage = cms.getAdminPage($page.params.adminPath)
  $: args = adminPath.split('/')
  if (!adminData && adminPage?.GET) adminData = adminPage.GET({cms, args})

</script>

{#await data}
  fetching data...
{:then data}
  <CmsAdmin {cms} data={adminData} {adminPath} url={$page.url} />
{/await}
