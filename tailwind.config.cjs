const extract = (content) => { return content.match(/(?<=\.)[-\w:]+/g) || [] }

const config = {
  content: {
    files: [
      "./src/**/*.{html,js,svelte,ts}",
      "./src/sveltecms.config.{json,yml}",
      "./content/**/*.{md,yml,json}",
    ],
    extract: {
      json: extract,
      yml: extract,
      md: extract,
    },
  },

  theme: {
    extend: {},
  },

  corePlugins: {
    aspectRatio: false,
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};

module.exports = config;
