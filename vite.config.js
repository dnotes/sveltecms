import { sveltekit } from '@sveltejs/kit/vite';
import yaml from '@rollup/plugin-yaml';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
		sveltekit(),
		yaml(),
	],
	// resolve: {
	// 	alias: {
  //     $lib: path.resolve('src/local'),
  //     sveltecms: path.resolve('src/lib'),
	// 	}
	// }
};

export default config;
