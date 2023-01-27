---
title: Core Concept
_slug: core-concept
_oldSlug: core-concept
_type: docs
---
**SvelteCMS is basically a pre-built part of a SvelteKit project.**

You can see the routes provided by SvelteCMS in the `src/routes/(cms)` directory:

```
src
  routes
    (cms)
      [...path]
        +layout.svelte
        +layout.ts
        +page.svelte
      admin
        [...adminPath]
          +page.server.ts
          +page.svelte
          +page.ts
          +server.ts
        +layout@.svelte
```


Accordingly, a SvelteCMS site should function and deploy like any other SvelteKit project. It can be used as a static site builder or as a set of serverless functions, or even a mixture of both:

### 1. Static site builder

SvelteCMS defaults to working as a static site builder. You can use it with SvelteKit's `@sveltejs/adapter-static` and the site should deploy to any static host, usually automatically when you push to your repository. Your content editing workflow would look something like this:

1. Run your local site with `npm run dev`
2. Configure the CMS and edit content through the Admin UI
3. Commit and push changes to your repository

In this scenario, SvelteCMS is only available during local development. However, we are exploring ways to use WebContainers or isomorphic git to make SvelteCMS into a truly serverless site builder that would run on your site. In this case, the site's content editors might:

1. Login with GitHub credentials to access the Admin UI
2. Edit content in the Admin UI
3. Preview the changes live, locally, in the browser, in context of the full site
4. Push change sets to the public repository, making them live for everyone

While this exact workflow is probably a ways out, services like StackBlitz show that it's possible to run SvelteCMS inside a WebContainer. [Try SvelteCMS on StackBlitz](#){.stackblitz} (*experimental*<noscript>, requires javascript</noscript>).

### 2. Deploy to a serverless provider

In this scenario, the SvelteCMS Admin UI would be available on your site, users would be able to add content in the familiar ways:

1. Login through an Auth provider[^1]
2. Create and edit content through the Admin UI

### 3. Hybrid static/dynamic site

You may wish to have some content be served from static files while another is dynamic and user-submitted. Examples might be blog posts with comments or products with user reviews. In this case you could prerender the main content types (posts or products) from the git repository, but use SvelteCMS's components and endpoints to user submissions for the secondary content type (comments or reviews).


[^1]: While the last two scenarios are definitely within the scope of what SvelteCMS will provide, *SvelteCMS does not yet have user management, permissions or form validation*{.text-amber-500}, and setting everything up securely at this time would be ... a very interesting challenge!