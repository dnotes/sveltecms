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
	adapter: adapter(),
	kit: {
		alias: {
      $lib: path.resolve('src/local'),
      sveltecms: path.resolve('src/lib'),
		},
		package: {
			exports: (filepath) => {
				return !(filepath.match(/\/local\//))
			}
		},
	}
};

export default config;
