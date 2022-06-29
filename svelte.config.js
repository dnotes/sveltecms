import path from 'path';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static'
import yaml from '@rollup/plugin-yaml'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
	adapter: adapter(),
	kit: {
		vite: {
			resolve: {
				alias: {
					sveltecms: path.resolve('src/lib'),
					'$lib': path.resolve('src/local'),
				}
			},
			plugins: [
				yaml()
			]
		},
		package: {
			exports: (filepath) => {
				return !(filepath.match(/\/local\//))
			}
		},
	}
};

export default config;
