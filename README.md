## Functions of a CMS

[ ] Allow external users to create and edit content

    At the moment, most small SvelteKit sites either use Markdown files that live in the repository
    or else collect content maintained in other systems. The content is contributed by the developer.
    Svelte CMS provides configurable tools for users--not developers--to create and edit content, and
    easy pluggable integrations for saving content to a database, external API, git repository, etc.

[ ] Rebuild the site when necessary

    The site build must either be triggered by the developer or be automated by an external service.
    Svelte CMS plans to provide configurable, pluggable integrations for triggering automated build
    processes, either as content is added or according to a schedule.

[ ] Sanitize user-submitted content for display in browsers

    Since most content for small SvelteKit sites is contributed by the developer, content security is
    not really a consideration. Svelte CMS provides configurable tools for sanitizing user-submitted
    content.

[ ] Manage content authorship and role-based editing permissions

    Svelte CMS configuration should be able to work with any authentication system to manage content
    authorship and simple role-based permissions.

[ ] Manage users as content

    Svelte CMS can also manage a small user base, like an editing team, providing authentication with
    serverless functions or containerized endpoints.

[ ] Manage content based on data structure and configuration



[ ] Allow users to configure the CMS

    Because it uses declarative configuration, Svelte CMS can provide a web front-end for configuration,
    allowing privileged users to configure the CMS without accessing the git repository.