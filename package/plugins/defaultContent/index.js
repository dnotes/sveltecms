const plugin = {
    id: 'defaultContent',
    fields: [
        {
            id: 'title',
            type: 'text',
            index: true,
            required: true,
            displays: {
                default: {
                    type: 'h2',
                    link: true,
                },
                reference: {
                    type: 'span',
                    link: true,
                },
                page: 'h1'
            }
        },
        {
            id: 'postDate',
            type: 'date',
            index: true,
            required: true,
            default: '$now',
        },
        {
            id: 'body',
            type: 'markdown',
        },
        {
            id: 'slug',
            type: 'text',
            displays: 'none',
            required: 'true',
        },
        {
            id: 'mainImage',
            type: 'image',
            index: true,
            mediaStore: {
                type: 'staticFiles',
                options: {
                    mediaDirectory: 'images/main',
                    allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif'],
                }
            }
        },
        {
            id: 'tags',
            type: 'reference',
            widget: {
                type: 'reference',
                options: {
                    referenceKey: 'taggedContent',
                    contentTypes: 'tags',
                    freeTagging: true,
                }
            }
        },
        {
            id: 'taggedContent',
            type: 'reference',
            widget: {
                type: 'reference',
                options: {
                    referenceKey: 'tags',
                    displayMode: 'teaser',
                }
            }
        }
    ],
    contentTypes: [
        {
            id: 'page',
            slug: 'slug',
            fields: {
                title: 'title',
                slug: 'slug',
                image: 'mainImage',
                body: 'body',
            },
            contentStore: 'staticFiles',
        },
        {
            id: 'blog',
            slug: 'date,title',
            fields: {
                image: 'mainImage',
                title: 'title',
                date: 'postDate',
                body: 'body',
                tags: 'tags',
            },
            contentStore: 'staticFiles',
        },
        {
            id: 'tags',
            slug: 'title',
            fields: {
                title: 'title',
                body: 'body',
            },
            contentStore: 'staticFiles',
        }
    ]
};
export default plugin;
