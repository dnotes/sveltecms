import path from 'path';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	adapter: adapter(),
	kit: {
		vite: {
			resolve: {
				alias: {
					sveltecms: path.resolve('src/lib'),
					'$lib': path.resolve('src/local'),
				}
			}
		},
		package: {
			exports: (filepath) => {
				return !(filepath.match(/\/local\//))
			}
		},
	}
};

export default config;
