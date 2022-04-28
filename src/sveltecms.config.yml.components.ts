import BlogPost from '$lib/display/BlogPost.svelte'

export const components = {
  BlogPost
}

export default Object.entries(components).map(([id,component])=>({id,component}))