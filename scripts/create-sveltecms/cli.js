#!/usr/bin/env node
import sade from 'sade'
import {bold,cyan,green,gray,yellow,red} from 'kleur/colors'
import prompts from 'prompts'
import { create } from '.'
import path from 'path'

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'));

sade('create-sveltecms [directory]', true)
  .describe('Create a new SvelteKit site with SvelteCMS installed.')
  .option('--yes, -y', 'just continue through all the prompts, accepting any default values and overwriting any files, full speed ahead!', false)
  .version(version)
  .action(async (directory, opts) => {
    console.log(bold(gray(`Create SvelteCMS ${version}`)))

    let cwd=""
    let options={}
    let answers={}


    if (!opts.yes) {

      // Sort out all the options
      let qs = []

      // * directory
      if (!dir) qs.push({
        type: 'text',
        name: 'directory',
        message: 'Where should your project be created?\n (leave blank to use the current directory)',
      })

      // * json or yaml for config

      // * tailwind (with typography or without)

      // * create-svelte options
      qs.push(...[{
        type: 'toggle',
        name: 'eslint',
        message: 'Add ESLint for code linting?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      },
      {
        type: 'toggle',
        name: 'prettier',
        message: 'Add Prettier for code formatting?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      },
      {
        type: 'toggle',
        name: 'playwright',
        message: 'Add Playwright for browser testing?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      },
      {
        type: 'toggle',
        name: 'vitest',
        message: 'Add Vitest for unit testing?',
        initial: false,
        active: 'Yes',
        inactive: 'No'
      }])

      answers = await prompts(qs)

    }

    // Get the directory and all options
    cwd = answers?.directory || directory || '.'

    Object.assign(options, answers)

    // Check the directory for existing contents
    if (!opts.yes) {
      if (fs.existsSync(cwd)) {
        if (fs.readdirSync(cwd).length > 0) {
          let response = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Directory not empty. Continue?',
            initial: false
          });

          if (!response.value) {
            console.log(gray(`Exiting...`))
            process.exit(1);
          }
        }
      }
    }

    // Do the actual stuff
    console.log(green(`Creating new SvelteCMS site in ${cwd === '.' ? 'the current directory' : cwd}.`))

    await create(cwd, options)

    if (options.eslint) {
      console.log(bold('✔ ESLint'));
      console.log(cyan('  https://github.com/sveltejs/eslint-plugin-svelte3'));
    }

    if (options.prettier) {
      console.log(bold('✔ Prettier'));
      console.log(cyan('  https://prettier.io/docs/en/options.html'));
      console.log(cyan('  https://github.com/sveltejs/prettier-plugin-svelte#options'));
    }

    if (options.playwright) {
      console.log(bold('✔ Playwright'));
      console.log(cyan('  https://playwright.dev'));
    }

    if (options.vitest) {
      console.log(bold('✔ Vitest'));
      console.log(cyan('  https://vitest.dev'));
    }

  })
