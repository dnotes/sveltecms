---
title: Getting Started
_slug: getting-started
_oldSlug: getting-started
_type: docs
---
Install SvelteCMS with NPM:

```

> npm create sveltecms@latest
> npm run dev

```

After it is installed, you should be able to begin creating content through the Admin UI. You can also build out Fields and Content Types much as you might with any other Content Management System.

## How to publish a SvelteCMS site?

SvelteCMS is really just a pre-built section of a SvelteKit project, and it should deploy like any other SvelteKit project. It can be used as a static site builder or as a set of serverless functions, or even a mixture of both. Here are three different scenarios for using SvelteCMS:

### Build a static site

SvelteCMS defaults to working as a static site builder. You can use it with SvelteKit's `@sveltejs/adapter-static` and the site should deploy to any static host, usually automatically when you push to your repository. Your content editing workflow would look something like this:

1. Run your local site with `npm run dev`
2. Configure the CMS and edit content through the Admin UI
3. Commit and push changes to your repository

In this scenario, the SvelteCMS Admin UI will not be a part of your site when it is deployed; it will only be available in development mode. However, you'll still get all the benefits of tagging, media management, content modeling, etc.

### Deploy to a serverless provider

SvelteCMS is part of your SvelteKit project, so it should deploy to any serverless provider that supports SvelteKit. In this scenario, the SvelteCMS Admin UI would be available on your site, and other site visitors would be able to add content as well.

*SvelteCMS does not yet have user management or form validation*{.text-amber-500}, and setting this up in a secure way without those things would be ... a very interesting challenge!

### Build a static site ... using your browser!?

It should be possible to run SvelteCMS *in the browser* and push content changes back to a static repository. In this scenario, a user might login using their GitHub account to gain access to the Admin UI, make content changes as desired, preview those changes locally on the live site, and then push them back to the repository, at which point the static site would update for everyone.

We are exploring using technologies like the WebContainer API, isomorphic-git, and lightning-fs to provide a first-class site building experience that runs entirely in the browser. It will be a while before this is ready, but as a demonstration, you can try running SvelteCMS in a StackBlitz WebContainer: