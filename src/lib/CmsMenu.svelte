<script lang="ts">
  import cms from '$lib/cms'

  export let contentTypeID:string = ''
  export let showAdmin = import.meta.env.MODE === 'development'

  let {rootContentType,frontPageSlug} = cms?.conf?.settings ?? {}

  let items:{href:string,text:string}[] = contentTypeID ? [] : Object.keys(cms.contentTypes || {})
    .filter(id => (id !== rootContentType))
    .map(id => ({
      href: `/${id}`,
      text: cms.contentTypes[id].label
    }))

  if (contentTypeID) {
    try {
      cms.listContent(contentTypeID).then(contentList => {
        if (Array.isArray(contentList)) items = contentList
          .filter(item => (contentTypeID !== rootContentType || item._slug !== frontPageSlug))
          .map(item => ({
            href: `${contentTypeID === rootContentType ? '' : `/${contentTypeID}`}/${item._slug}`,
            text: item?.title?.toString() ?? item?._slug?.replace(/-+/g,' ') ?? 'link'
          }))
      })
    }
    catch(e) {
      // there was no content available for the menu
    }
  }

</script>

{#if items.length}
  <slot></slot>
  {#each items as {href,text}}
    <a {href}>{text}</a>
  {/each}
  {#if showAdmin}
    <a href="/admin">Admin</a>
  {/if}
{/if}
