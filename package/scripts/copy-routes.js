#!/usr/bin/env node
import cp from 'cp-file';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fromPath = path.resolve(__dirname, '../routes');
const toPath = path.resolve(process.env.INIT_CWD, 'src/routes');
const files = [
    [`${fromPath}/[...path].svelte`, `${toPath}/[...path].svelte`],
    [`${fromPath}/[...path].ts`, `${toPath}/[...path].ts`],
    [`${fromPath}/admin/[...adminPath].svelte`, `${toPath}/admin/[...adminPath].svelte`],
    [`${fromPath}/admin/[...adminPath].ts`, `${toPath}/admin/[...adminPath].ts`],
    [`${fromPath}/admin/__layout.svelte`, `${toPath}/admin/__layout.svelte`],
];
files.forEach(([file, dest]) => {
    try {
        cp.sync(file, dest);
        console.log(`copied ${file} -> ${dest}`);
    }
    catch (e) {
        e.message = `Error copying SvelteCMS file "${file}" -> "${dest}":\n${e.message}`;
        throw e;
    }
});
