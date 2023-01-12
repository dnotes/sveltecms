#!/usr/bin/env node
import cp from 'cp-file';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fromPath = path.resolve(__dirname, '../install');
const toPath = path.resolve(process.env.INIT_CWD);
const files = [
    // The default front page route
    [`${fromPath}/routes/+layout.svelte`, `${toPath}/src/routes/+layout.svelte`],
    // The '/[...path]' routes
    [`${fromPath}/routes/(cms)/[...path]/+page.svelte`, `${toPath}/src/routes/(cms)/[...path]/+page.svelte`],
    [`${fromPath}/routes/(cms)/[...path]/+layout.ts`, `${toPath}/src/routes/(cms)/[...path]/+layout.ts`],
    // The '/admin' routes
    [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.svelte`, `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.svelte`],
    [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.ts`, `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.ts`],
    [`${fromPath}/routes/(cms)/admin/[...adminPath]/+page.server.ts`, `${toPath}/src/routes/(cms)/admin/[...adminPath]/+page.server.ts`],
    [`${fromPath}/routes/(cms)/admin/[...adminPath]/+server.ts`, `${toPath}/src/routes/(cms)/admin/[...adminPath]/+server.ts`],
    [`${fromPath}/routes/(cms)/admin/+layout.svelte`, `${toPath}/src/routes/(cms)/admin/+layout.svelte`],
    // Files for the $lib folder
    [`${fromPath}/cms.ts`, `${toPath}/src/lib/cms.ts`],
    [`${fromPath}/sveltecms.config.json`, `${toPath}/src/lib/sveltecms.config.json`],
    [`${fromPath}/sveltecms.config.yml`, `${toPath}/src/lib/sveltecms.config.yml`],
    // Files for dependencies (SvelteKit, Vite, Tailwind)
    [`${fromPath}/tailwind.config.cjs`, `${toPath}/tailwind.config.cjs`],
];
files.forEach(([file, dest]) => {
    try {
        cp.sync(file, dest, { overwrite: false });
        console.log(`copied ${file} -> ${dest}`);
    }
    catch (e) {
        console.error(`Error copying SvelteCMS file "${file}" -> "${dest}":\n${e.message}`);
    }
});
if (!fs.existsSync(`${toPath}/src/content`))
    fs.mkdirSync(`${toPath}/src/content`);
const contentTypes = ['page', 'blog', 'tags'];
contentTypes.forEach(id => {
    let filepath = `${toPath}/src/content/_${id}.index.json`;
    if (!fs.existsSync(filepath))
        fs.writeFileSync(filepath, '[]', { encoding: 'utf8' });
});
if (!fs.existsSync(`${toPath}/src/cms`))
    fs.mkdirSync(`${toPath}/src/cms`);
if (!fs.existsSync(`${toPath}/src/cms/README.txt`))
    fs.writeFileSync(`${toPath}/src/cms/README.txt`, `This is the folder where SvelteCMS looks for custom components.

Any .svelte files in this folder will be available when configuring
the display of fields, fieldgroups, and content types in the Admin UI.`, { encoding: 'utf8' });
