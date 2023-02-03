const plugin = {
    id: 'defaultContent',
    conf: {
        settings: {
            rootContentType: 'page',
            frontPageSlug: 'front',
        },
        mediaStores: {
            images: {
                type: 'staticFiles',
                mediaDirectory: 'images',
                allowedMediaTypes: ['image/jpeg', 'image/png', 'image/gif'],
            }
        },
        fields: {
            postDate: {
                type: 'date',
                index: true,
                required: true,
                default: '$now',
            },
            body: {
                type: 'markdown',
            },
            slug: {
                type: 'text',
                displays: 'none',
                required: 'true',
            },
            mainImage: {
                type: 'image',
                index: true,
                mediaStore: {
                    type: 'images',
                    mediaDirectory: 'images/main',
                }
            },
            blocks: {
                type: 'fieldgroup',
                multiple: true,
                displays: {
                    default: 'none',
                    page: 'div',
                },
                widget: {
                    type: 'fieldgroup',
                    useComponents: true,
                    fieldgroupTags: [
                        'fullwidth',
                        'block'
                    ],
                }
            },
            tags: {
                type: 'reference',
                widget: {
                    type: 'reference',
                    referenceKey: 'taggedContent',
                    contentTypes: 'tags',
                    freeTagging: true,
                }
            },
            taggedContent: {
                type: 'reference',
                widget: {
                    type: 'reference',
                    referenceKey: 'tags',
                    displayMode: 'teaser',
                }
            }
        },
        fieldgroups: {
            image: {
                id: 'image',
                tags: ['fullwidth', 'block', 'inline'],
                displays: 'div',
                fields: {
                    image: 'image',
                },
            },
        },
        contentTypes: {
            page: {
                slug: 'slug',
                fields: {
                    title: 'title',
                    slug: 'slug',
                    header: 'blocks',
                    body: 'body',
                    footer: 'blocks',
                },
                contentStore: 'staticFiles',
            },
            blog: {
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
        }
    },
};
export default plugin;
