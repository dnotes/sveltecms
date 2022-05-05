<script context="module" lang="ts">
  export const prerender = false
  export const router = false
</script>

<script lang="ts">
  import adminPlugin from 'sveltecms/plugins/admin'
  import cms from '$lib/cms'
  cms.use(adminPlugin)

  // @ts-ignore todo: why doesn't it find this?
  import { page } from '$app/stores'
  import CMSAdmin from 'sveltecms/CMSAdmin.svelte'

  export let data

  let adminPath = $page.params.adminPath
  let adminPage = cms.getAdminPage($page.params.adminPath)
  let args = adminPath.split('/')
  if (!data && adminPage?.get) data = adminPage.get({cms, args})

</script>

<CMSAdmin {cms} {data} {adminPath} />