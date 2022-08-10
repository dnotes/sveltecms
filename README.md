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


### Recommended: Setup YAML for configuration

**If you want to use YAML** instead of JSON for storing SvelteCMS configuration,
you will want to install and configure `@rollup/plugin-yaml`.
This is recommended at present because some relatively common functionality must
still be configured manually.

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


### Optional: Use TailwindCSS

**TailwindCSS works very well with SvelteCMS** for display of elements and ad-hoc
styles in content. TailwindCSS can parse classes in the SvelteCMS config file and in
locally stored content, but it needs to be configured with where to look for the files
and how to recognize the classes.

* Install Tailwind (and any plugins):

    You can either do this manually or with a svelte-add command, e.g.
    `npx svelte-add@latest tailwindcss --tailwindcss-typography`

* Modify the `tailwind.config.cjs` file:

    This file is where you tell Tailwind how to find the classes in your config
    and content. Replace the first part of the `config` variable with the code below:

    ``` js
    /**
     * Function to extract classes from the text of matching content files.
     * The regex-based search matches class names preceeded by a period.
     * Class names are alpha-numeric plus dashes, underscores, and colons.
     * This should work for SvelteCMS Displays and class attributes added
     * with markdown-it-attrs, as both use the ".class-name" syntax.
     */
    const extract = (content) => {
        return content.match(/(?<=\.)[-\w:]+/g) || []
    }

    const config = {
        // The content array must be expanded into an object.
        content: {
            // Files in this list should be checked for tailwind classes.
            files: [
                "./src/**/*.{html,js,svelte,ts}", // This line is default.
                "./src/sveltecms.config.{json,yml}",
                "./content/**/*.{md,yml,json}",
            ],
            // The content.extract configuration tells Tailwind to use
            // the function defined above for .json, .yml, and .md files.
            extract: {
                json: extract,
                yml: extract,
                md: extract,
            },
        },
        ...
    }
    ```

### Optional: Use plain JS

**If you are not using TypeScript**, you will at present need to manually modify
the install files copied by SvelteCMS to conform to plain JS syntax.

* change filename extensions from `.ts` to `.js`
* in `.svelte` files, remove `lang="ts"` from the script tags
* remove all TypeScript-specific syntax from `.js` and `.svelte` files


## Usage

SvelteCMS is now a part of your SvelteKit app. For local development, you can
run SvelteKit as you normally would:

`npm run dev`

Then go to the admin interface in your browser, which is located by default at
[//localhost:3000/admin](//localhost:3000/admin).
