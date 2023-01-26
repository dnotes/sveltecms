/** @type { {path:string, src?:string, required?:true, description:string}[] } */
export const manifest = [
  {
    "path": "src/routes/+layout.svelte",
    "src": "src/install/+layout.svelte",
    "description": "The root layout component for the site."
  },
  {
    "path": "src/app.css",
    "src": "src/install/app.css",
    "description": "A default site-wide CSS file for the site."
  },
  {
    "path": "src/routes/(cms)/+layout.ts",
    "required":true,
    "description": "The layout load functions that retrieve content for CMS paths."
  },
  {
    "path": "src/routes/(cms)/+layout.svelte",
    "description": "The layout component for content pages."
  },
  {
    "path": "src/routes/(cms)/[...path]/+layout.ts",
    "required": true,
    "description": "The layout load functions that return 404 or 301 if the path is not found elsewhere."
  },
  {
    "path": "src/routes/(cms)/[...path]/+page.svelte",
    "required": true,
    "description": "The page component for all content paths handled by the CMS."
  },
  {
    "path": "src/routes/(cms)/admin/+layout@.svelte",
    "description": "The layout reset component for the SvelteCMS Admin UI. Layout for the content paths should not affect the Admin UI."
  },
  {
    "path": "src/routes/(cms)/admin/[...adminPath]/+page.server.ts",
    "required": true,
    "description": "Server routes for form sumissions to the Admin UI."
  },
  {
    "path": "src/routes/(cms)/admin/[...adminPath]/+server.ts",
    "required": true,
    "description": "REST functions for the Admin UI."
  },
  {
    "path": "src/routes/(cms)/admin/[...adminPath]/+page.ts",
    "required": true,
    "description": "Page load functions for the Admin UI."
  },
  {
    "path": "src/routes/(cms)/admin/[...adminPath]/+page.svelte",
    "required": true,
    "description": "The page display component for the Admin UI."
  },
  {
    "path": "src/lib/cms.ts",
    "src": "src/install/cms.ts",
    "required": true,
    "description": "The file where the CMS is created. Expected by several SvelteCMS page and layout components."
  },
  {
    "path": "src/lib/sveltecms.config.json",
    "src": "src/install/sveltecms.config.json",
    "description": "The default JSON configuration file for SvelteCMS."
  },
  {
    "path": "src/lib/sveltecms.config.yml",
    "src": "src/install/sveltecms.config.yml",
    "description": "The default Yaml configuration file for SvelteCMS."
  },
  {
    "path": "src/cms/_README.txt",
    "src": "src/install/_README.txt",
    "description": "The readme file which explains the src/cms folder."
  },
  {
    "path": "tailwind.config.cjs",
    "src": "src/install/tailwind.config.cjs",
    "description": "The default tailwind configuration file with settings for SvelteCMS config and content."
  },
  {
    "path": "README.md",
    "src": "src/install/README.md",
    "description": "The default readme file for new SvelteCMS installations."
  }
]

export default manifest