## Pre-install: Setup SvelteKit app

You can start up a SvelteKit app as you usually would. However, be aware that
SvelteCMS will require some additional tinkering if you are not using TypeScript.
Therefore, we recommend using TypeScript for your SvelteKit app if you can.


## Installation

Install SvelteCMS into your SvelteKit app using the package manager of your choice:

`npm install sveltecms`

SvelteCMS uses an npm postinstall script to copy a few files into your repository,
including config files and routes for the admin interface and content display.
If you are installing SvelteCMS with the `--ignore-scripts` flag, you can run
the script manually from the command line:

`node ./node_modules/sveltecms/scripts/postinstall.js`


### Optional: Use plain JS

**If you are not using TypeScript**, you will at present need to manually modify
the install files copied by SvelteCMS to conform to plain JS syntax.

* change filename extensions from `.ts` to `.js`
* in `.svelte` files, remove `lang="ts"` from the script tags
* remove all TypeScript-specific syntax from `.js` and `.svelte` files


### Optional: Setup YAML for configuration

**If you want to use YAML** instead of JSON for storing SvelteCMS configuration,
you will want to install and configure `@rollup/plugin-yaml`.

* Install the plugin: \
    `npm install @rollup/plugin-yaml`

* Configure Vite to use the plugin in `svelte.config.js`:
    ```
    import yaml from '@rollup/plugin-yaml'
    ...
    const config = {
        kit: {
            vite: {
                plugins: [
                    yaml();
                ]
            }
        }
    }
    ```

* Configure SvelteCMS to use the correct file in `src/lib/cms.ts`: \
    ~~`import conf from './sveltecms.config.json'`~~ \
    **`import conf from './sveltecms.config.yml'`**


## Usage

SvelteCMS is now a part of your SvelteKit app. For local development, you can
run SvelteKit as you normally would:

`npm run dev`

Then go to the admin interface in your browser, which is located by default at
[//localhost:3000/admin](//localhost:3000/admin).
