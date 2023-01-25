import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
	kit: {
		adapter: adapter({
			strict: false,
		}),
		alias: {
      sveltecms: path.resolve('src/sveltecms'),
		},
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'ignore',
		}
	},
	package: {
		source: 'src/sveltecms'
	},
};

export default config;
