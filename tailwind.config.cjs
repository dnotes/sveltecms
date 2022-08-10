/**
 * Function to extract classes from the text of matching content files.
 * The regex-based search matches class names preceeded by a period.
 * Class names are alpha-numerica, but may include dashes, underscores,
 * or colons.
 */
const extract = (content) => {
  return content.match(/(?<=\.)[-\w:]+/g) || []
}

const config = {
  // The content array must be expanded into an object.
  content: {
    // Files in this list should be checked for tailwind classes.
    files: [
      "./src/**/*.{html,js,svelte,ts}",
      "./src/sveltecms.config.{json,yml}",
      "./content/**/*.{md,yml,json}",
    ],
    // The content.extract configuration tells Tailwind to use
    // the function defined above for .json, .yml, and .md files.
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
