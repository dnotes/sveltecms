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
		adapter: adapter(),
		alias: {
      sveltecms: path.resolve('src/sveltecms'),
		},
	},
	package: {
		exports: (filepath) => {
			return !(filepath.match(/\/local\//))
		}
	},
};

export default config;
