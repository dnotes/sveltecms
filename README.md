# What is SvelteCMS?

SvelteCMS is an attempt at creating a new kind of Content Management System that builds fast SvelteKit websites with content models from a configurable CMS but doesn't require running a server or subscribing to a content SAAS. SvelteCMS...

* [x] is **software**, not a product or service.
* [x] runs **as part of the site**, not on a separate system.
* [x] builds **performant web apps**, with minimal code on content pages, SSR and prerendering.[^1]
* [x] builds **sites that work without Javascript**, so no more blank white screens.
* [x] is **database agnostic**: store content in any server, repository, or database provider[^2].
* [x] supports **data portability**: mix, match, and migrate content between storage solutions[^3].
* [] supports **community interaction**: manage user accounts from install[^4].
* [x] supports **serverless architecture**: deploy CMS endpoints to any serverless provider[^5].
* [x] supports **static site generation**: build locally and deploy to any web host.
* [x] works **in the browser**: go truly "serverless" with Web Containers or isomorphic git.
* [x] supports **complex content models**: conditional, nested, and calculated fields.
* [x] manages the **full content cycle**: entry, storage, retrieval and display.
* [x] enables **code-free site building**: go from data architecture to display with no code.
* [x] is **extensible**: extend CMS functionality with components, plugins and hooks.
* [x] is **free** for any number of sites, users, content types, plugins, etc.

[^1]: Server-side rendering and prerendering work, and it is possible to produce static pages without javascript, but for the pages rendered client-side there is a lot of optimization still to be done.
[^2]: Requires plugins.
[^3]: Requires plugins.
[^4]: Requires plugins and a new bit of API.
[^5]: Theoretically any serverless host that supports SvelteKit should work with SvelteCMS.

---

## Installation

You can create a new SvelteCMS project, including the SvelteKit setup, using npm:

```

> npm create sveltecms@latest
> npm run dev

```

### Optional: Use TailwindCSS

**SvelteCMS works very well with TailwindCSS** (and likely with similar utility css
frameworks like WindyCSS) for display of elements and ad-hoc styles in content.
TailwindCSS can parse classes in the SvelteCMS config file and in locally stored content,
but it needs to be told where to look for the files and how to recognize the classes.
Luckily SvelteCMS comes with the proper functions already in the tailwind.config.cjs file.
However, you still need to install and configure Tailwind and PostCSS:

* Install Tailwind (and any plugins):

    You can either do this manually or with a svelte-add command, e.g.
    `npx svelte-add@latest tailwindcss --tailwindcss-typography`

* Afterward, don't forget to run `npm install`!


### Optional: Setup YAML for configuration

**If you want to use YAML** instead of JSON for storing SvelteCMS configuration,
you will want to install and configure `@rollup/plugin-yaml`.

* Install the plugin: \
    `npm install @rollup/plugin-yaml`

* Configure Vite to use the plugin in `vite.config.js`:

    ``` js
    import yaml from '@rollup/plugin-yaml'
    ...
    const config = {
        plugins: [
            ...
            yaml(),
        ]
    };
    ```

* Configure SvelteCMS to use the correct file in `src/lib/cms.ts`: \
    ~~`import conf from './sveltecms.config.json'`~~ \
    **`import conf from './sveltecms.config.yml'`**

* Add type for .yml files in `src/app.d.ts` \

    ``` js
    declare global {
        // other stuff...
        module "*.yml" {
            const value: any;
            export default value;
        }
    }
    ```


## Usage

You should have a new SvelteKit project with SvelteCMS included
You will find SvelteCMS-specific files in the `src/routes/(cms)` folder.

For local development, you can start SvelteKit as you normally would:

`npm run dev`


## ...Why?

> What is this? A center for ANTS!? It needs to be at least ... three times bigger! \
  \- Derek Zoolander

SvelteCMS was made to demonstrate and jump-start my vision for what a Content Management
System could be in 2023. I want to build fast modern websites with content models from a
configurable CMS, but I don't want to run a server or subscribe to a paid SAAS API.
Hopefully this helps to move things forward.
