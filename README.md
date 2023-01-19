## Pre-install: Setup SvelteKit with version 1.0.x

You can create a SvelteKit app as you usually would.

* `npm create svelte`

SvelteCMS will require some additional tinkering if you are not using TypeScript.
Therefore, it is easiest to choose TypeScript syntax for your SvelteKit app.

* *select the option* :  `Yes, using TypeScript syntax`

## Installation

Install SvelteCMS into your SvelteKit app using the package manager of your choice:

`npm install sveltecms`

SvelteCMS uses an npm postinstall script to copy a few files into your repository,
including config files and routes for the admin interface and content display.
If you are installing SvelteCMS with the `--ignore-scripts` flag, you can run
the script manually from the command line:

`node ./node_modules/sveltecms/scripts/postinstall.js`


### Recommended: Setup YAML for configuration

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


### Recommended: Use TailwindCSS

**SvelteCMS works very well with TailwindCSS** (and likely with similar utility css
frameworks like WindyCSS) for display of elements and ad-hoc styles in content.
TailwindCSS can parse classes in the SvelteCMS config file and in locally stored content,
but it needs to be told where to look for the files and how to recognize the classes.

* Install Tailwind (and any plugins):

    You can either do this manually or with a svelte-add command, e.g.
    `npx svelte-add tailwindcss --tailwindcss-typography`

* Modify the `tailwind.config.cjs` file provided by SvelteCMS

    The configuration provided by SvelteCMS includes several TailwindCSS plugins.
    If you haven't installed them, remove them from the configuration.


### Optional: Use plain JS

**If you are not using TypeScript**, you will at present need to manually modify
the install files copied by SvelteCMS to conform to plain JS syntax.

* change filename extensions from `.ts` to `.js`
* in `.svelte` files, remove `lang="ts"` from the script tags
* remove all TypeScript-specific syntax from `.js` and `.svelte` files


## Usage

SvelteCMS is now a part of your SvelteKit app. You will find SvelteCMS files in the
`src/routes/(cms)` folder.

For local development, you can run SvelteKit as you normally would:

`npm run dev`

Then go to the admin interface in your browser, which is located by default at
[//localhost:5173/admin](//localhost:5173/admin).

## ...Why?

> What is this? A center for ANTS!? It needs to be at least ... three times bigger!
  \- Derek Zoolander

SvelteCMS was made to demonstrate and jump-start my vision for what a Content Management
System could be in 2023. I want to build fast modern websites with content models from a
configurable CMS, but I don't want to run a server or subscribe to a paid SAAS API.
Hopefully this helps to move things forward.

SvelteCMS...

* [x] is **software**, not a product or service.
* [x] runs **as part of the site**, not on a separate system.
* [x] builds **performant web apps**, with minimal code on content pages, SSR and prerendering.
* [x] builds **sites that work without Javascript**, so no more blank white screens.
* [x] is **database agnostic**: store content in any server, repository, or database provider.
* [x] supports **data portability**: mix, match, and migrate content between storage solutions.
* [ ] supports **community interaction**: manage user accounts from install.
* [x] supports **serverless architecture**: deploy CMS endpoints to any serverless provider.
* [x] supports **static site generation**: build locally and deploy to any web host.
* [ ] works **in the browser**: go truly "serverless" with Web Containers or isomorphic git.
* [x] supports **complex content models**: conditional, nested, and calculated fields.
* [x] manages the **full content cycle**: entry, storage, retrieval and display.
* [x] enables **code-free site building**: go from data architecture to display with no code.
* [x] is **extensible**: extend CMS functionality with components, plugins and hooks.
* [x] is **free** for any number of sites, users, content types, plugins, etc.
