import { Component } from "sveltecms/core/Component";
import { saveContentEndpoint, deleteContentEndpoint } from 'sveltecms/utils';
export class AdminPage {
    constructor(conf, cms) {
        this.id = conf.id;
        if (conf.label)
            this.label = typeof conf.label === 'string' ? [conf.label] : conf.label;
        else
            this.label = [];
        this.component = new Component(conf.component, cms);
        this.GET = conf.GET;
        this.POST = conf.POST;
        this.DELETE = conf.DELETE;
    }
}
export const adminPages = [
    {
        id: 'content',
        component: 'CMSContentTypeList',
    },
    {
        id: 'content/*',
        component: 'CMSContentList',
        GET: async ({ cms, args }) => {
            return cms.listContent(args[1]);
        }
    },
    {
        id: 'content/*/*',
        component: 'CMSContentEdit',
        label: ['Content', , 'Edit'],
        GET: async ({ cms, args }) => {
            if (args[2] === '_')
                return {};
            return cms.getContent(args[1], args[2], { getRaw: true });
        },
        POST: async ({ cms, args, event, values }) => {
            if (event)
                return saveContentEndpoint(cms, args[1], event.request);
            else if (values)
                return cms.saveContent(args[1], values);
            throw new Error('Empty POST to content/*/*');
        },
        DELETE: async ({ cms, args, event, values }) => {
            if (event)
                return deleteContentEndpoint(cms, args[1], event.request);
            else if (values)
                return cms.deleteContent(args[1], values);
            throw new Error('Empty DELETE to content/*/*');
        }
    },
    {
        id: 'widgets',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            },
        },
    },
    {
        id: 'fields',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            },
        },
    },
    {
        id: 'fieldgroups',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            }
        }
    },
    {
        id: 'contentTypes',
        label: 'Content Types',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            }
        }
    },
    // {
    //   id: 'lists',
    //   configPath: 'lists',
    //   component: CMSConfigList,
    //   options: {
    //     fieldgroup: 'listConfig',
    //     stringField: 'tags',
    //   }
    // },
    {
        id: 'contentStores',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            },
        },
    },
    {
        id: 'mediaStores',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigEntityList',
            },
        },
    },
    {
        id: 'settings',
        component: {
            type: 'CMSConfigForm',
            options: {
                component: 'CMSConfigSettings',
            }
        },
        POST: async ({ cms, event, values }) => {
            if (event)
                return saveContentEndpoint(cms, cms.admin, event.request);
        }
    },
];
