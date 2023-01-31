import type { CMSPlugin } from "sveltecms/core/Plugin";

const plugin:CMSPlugin = {
  id: 'defaultContent',
  conf: {
    settings: {
      rootContentType: 'page',
      frontPageSlug: 'front',
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
          type: 'staticFiles',
          options: {
            mediaDirectory: 'images/main',
            allowedMediaTypes: ['image/jpeg','image/png','image/gif'],
          }
        }
      },
      blocks: {
        type: 'fieldgroup',
        multiple: true,
        widget: {
          type: 'fieldgroup',
          options: {
            useComponents: true,
            fieldgroupTags: [
              'fullwidth',
              'block'
            ],
          }
        }
      },
      tags: {
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
      taggedContent: {
        type: 'reference',
        widget: {
          type: 'reference',
          options: {
            referenceKey: 'tags',
            displayMode: 'teaser',
          }
        }
      }
    },
    contentTypes: {
      page: {
        slug: 'slug',
        fields: {
          title: 'title',
          slug: 'slug',
          image: 'mainImage',
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
}

export default plugin