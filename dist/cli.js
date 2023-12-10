#!/usr/bin/env node
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { green, yellow, gray, italic, red, bold, cyan } from 'kleur/colors';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import sade from 'sade';
import manifest from './manifest.js';
const cmsDir = path.dirname(fileURLToPath(new URL('package.json', import.meta.url).href)).replace(/\/src\/sveltecms$/, '');
const { version } = JSON.parse(fs.readFileSync(`${cmsDir}/package.json`, 'utf8'));
const prog = sade('sveltecms')
    .describe(`Command line interface for SvelteCMS (${version})`)
    .version(version);
prog.command('(none)', 'Show the full help for the program.', { default: true })
    .action(async () => {
    return prog.help();
});
prog.command('check', 'Check important SvelteCMS files for updates.')
    .option('--all, -a', 'Check all SvelteCMS installation files, not just the critical ones.', false)
    .option('--dir, -d', 'The root directory of the SvelteKit site.', '.')
    .action(async (opts) => {
    let templateDir = fs.existsSync(`${cmsDir}/.template`) ? `${cmsDir}/.template` : `${cmsDir}/package/.template`;
    let files = manifest;
    if (!opts.all)
        files = files.filter(f => f.keepUpdated);
    files = files.map(f => {
        let res = { ...f };
        res.cmsFile = `${templateDir}/${f.path}`;
        res.localFile = `${opts.dir}/${f.path}`;
        try {
            let canonicalFile = fs.readFileSync(res.cmsFile);
            let canonicalHash = crypto.createHash('sha256');
            canonicalHash.update(canonicalFile);
            res.canonical = canonicalHash.digest('hex');
        }
        catch (e) {
            res.canonical = "";
        }
        try {
            let installedFile = fs.readFileSync(res.localFile);
            let installedHash = crypto.createHash('sha256');
            installedHash.update(installedFile);
            res.installed = installedHash.digest('hex');
        }
        catch (e) {
            res.installed = "";
        }
        return res;
    });
    let outdatedFiles = files.filter(f => !f.canonical || !f.installed || f.canonical !== f.installed);
    let missingFiles = outdatedFiles.filter(f => !f.installed);
    if (missingFiles.length > 4) {
        let response = await prompts({
            type: 'toggle',
            name: 'continue',
            message: red(`It looks like your installation is missing ${missingFiles.length}/${files.length} necessary files; update anyway?`),
            initial: false,
            active: 'yes',
            inactive: 'no',
        });
        if (!response.continue) {
            console.log('Exiting.');
            return;
        }
        console.log(`Continuing update.`);
    }
    let filesToUpdate = outdatedFiles.length;
    let updatedFiles = 0;
    for (let i = 0; i < outdatedFiles.length; i++) {
        let f = outdatedFiles[i];
        let response = await prompts({
            type: 'toggle',
            name: 'update',
            message: `File: ${bold(cyan(f.path))} (${gray(italic(f.installed ? 'hashes differ' : 'not installed'))})
Description: ${f.description}
${cyan('Update this file?')}`,
            initial: true,
            active: 'yes',
            inactive: 'no',
        });
        if (response.update) {
            try {
                fs.copyFileSync(f.cmsFile, f.localFile);
                updatedFiles++;
                console.log(green(`Updated ${f.path}`));
            }
            catch (e) {
                console.log(red(`There was an error updating ${f.path}:\n${e}`));
            }
        }
        else {
            console.log(yellow(`SKIPPED: ${f.path}`));
        }
    }
    if (filesToUpdate) {
        console.log((filesToUpdate === updatedFiles ?
            green(`${updatedFiles}/${filesToUpdate} files updated. Your SvelteCMS installation is up-to-date.`) :
            yellow(`${updatedFiles}/${filesToUpdate} files updated. Please check the files that were not updated.`)));
    }
    else {
        console.log(green('Your SvelteCMS installation is up-to-date.'));
    }
});
prog.parse(process.argv);
