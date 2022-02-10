import type { SvelteCMSPlugin } from "sveltecms/global";

const localStoresPlugin:SvelteCMSPlugin = {
  contentStores: [
    {
      id: 'local',
      getContent: (contentType, opts, slug = '') => {
        const glob = `${opts.directory}/` +                             // base dir
          `${opts.appendContentTypeId ? contentType.id + '/' : ''}` +   // content type dir
          `${opts.recursive ? '**/' : ''}` +                            // recursive
          `${slug || '*'}` +                                            // one or all?
          `.(${opts?.fileExtensions?.join('|').replace(/\./g,'')})`     // file extensions
        const imports = import.meta.globEager(glob)

      },
      saveContent: (content, contentType, opts) => {

      },
      deleteContent: (content, contentType, opts) => {

      },
      optionFields: {
        directory: {
          type: 'text',
          default: '/content',
        },
        appendContentTypeId: {
          type: 'boolean',
          default: true,
        },
        recursive: {
          type: 'boolean',
          default: true,
        },
        fileExtensions: {
          type: 'tags',
          default: ['.md'],
        },
        saveNewAsExtension: {
          type: 'text',
          default: '.md',
          required: true,
        }
      }
    }
  ],
  mediaStores: [
    {
      id: 'local',
      saveMedia: (files, contentType, field) => {

      },
      deleteMedia: (files, contentType, field) => {

      },
    }
  ]
}
