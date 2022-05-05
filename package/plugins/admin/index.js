import { CMSContentEdit, CMSContentList, CMSConfigEdit, CMSConfigList, CMSConfigFieldList, CMSConfig } from './components';
export const adminPaths = [
    {
        id: 'config',
        component: CMSConfig,
    },
    {
        id: 'content',
        component: CMSContentList,
    },
    {
        id: 'content/*',
        component: CMSContentList,
    },
    {
        id: 'content/*/*',
        component: CMSContentEdit,
    },
    {
        id: 'types',
        configPath: 'types',
        title: 'Content Types',
        component: CMSConfigList,
    },
    {
        id: 'types/*',
        configPath: 'types',
        title: 'Content Types',
        component: CMSConfigEdit,
    },
    {
        id: 'fields',
        configPath: 'fields',
        component: CMSConfigList,
        options: {
            collection: 'fieldConfig',
            stringField: 'type',
        }
    },
    {
        id: 'widgets',
        configPath: 'widgets',
        component: CMSConfigList,
        options: {
            collection: 'widgetConfig',
            stringField: 'type',
        }
    },
    {
        id: 'lists',
        configPath: 'lists',
        component: CMSConfigList,
        options: {
            collection: 'listConfig',
            stringField: 'tags',
        }
    },
    {
        id: 'contentStores',
        configPath: 'contentStores',
        component: CMSConfigList,
        options: {
            collection: ''
        }
    },
    {
        id: 'mediaStores',
        configPath: 'mediaStores',
        component: CMSConfigList,
        options: {
            collection: ''
        }
    },
];
export const collections = [
    {
        id: 'fieldConfig',
        admin: true,
        fields: {
            type: {
                type: 'text',
                default: '',
                widget: {
                    type: 'select',
                    options: {
                        options: {
                            function: '$cmsFieldTypes()'
                        }
                    }
                }
            },
        },
    },
];
export default {
    adminPaths,
    collections,
};
