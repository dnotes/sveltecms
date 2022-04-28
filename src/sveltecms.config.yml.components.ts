import BlogPost from '$lib/content/BlogPost.svelte'

export const components = {
  BlogPost
}

export default Object.entries(components).map(([id,component])=>({id,component}))