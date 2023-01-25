---
title: Introduction
_slug: introduction
_oldSlug: introduction
_type: docs
---
## What is SvelteCMS?

SvelteCMS is an attempt at creating a new kind of Content Management System that builds fast SvelteKit websites with content models from a configurable CMS but doesn't require running a server or subscribing to a content SAAS.

## What is different about it?

### *SvelteCMS...* {.text-stone-500}

* [x] is **software**, not a product or service.
* [x] runs **as part of the site**, not on a separate system.
* [x] builds **performant web apps**, with minimal code on content pages, SSR and prerendering.[^1]
* [x] builds **sites that work without Javascript**, so no more blank white screens.
* [x] is **database agnostic**: store content in any server, repository, or database provider[^2].
* [x] supports **data portability**: mix, match, and migrate content between storage solutions[^3].
* [] supports **community interaction**: manage user accounts from install (with plugins).
* [x] supports **serverless architecture**: deploy CMS endpoints to any serverless provider[^4].
* [x] supports **static site generation**: build locally and deploy to any web host.
* [x] works **in the browser**: go truly "serverless" with Web Containers or isomorphic git.
* [x] supports **complex content models**: conditional, nested, and calculated fields.
* [x] manages the **full content cycle**: entry, storage, retrieval and display.
* [x] enables **code-free site building**: go from data architecture to display with no code.
* [x] is **extensible**: extend CMS functionality with components, plugins and hooks.
* [x] is **free** for any number of sites, users, content types, plugins, etc.

[^1]: there is still a lot that can probably be done to improve performance.
[^2]: requires plugins.
[^3]: requires plugins.
[^4]: theoretically any serverless host that supports SvelteKit should work with SvelteCMS.