import CMSContentEdit from './CMSContentEdit.svelte';
import CMSContentList from './CMSContentList.svelte';
import CMSConfigEdit from './CMSConfigEdit.svelte';
import CMSConfigList from './CMSConfigList.svelte';
export const defaultAdminPaths = {
    'content': CMSContentList,
    'content/*': CMSContentList,
    'content/*/*': CMSContentEdit,
    'types': CMSConfigList,
    'types/*': CMSConfigEdit,
    'fields': CMSConfigList,
    'fields/*': CMSConfigEdit,
    'widgets': CMSConfigList,
    'widgets/*': CMSConfigEdit,
    'lists': CMSConfigList,
    'lists/*': CMSConfigEdit,
    'contentStores': CMSConfigList,
    'contentStores/*': CMSConfigEdit,
    'mediaStores': CMSConfigList,
    'mediaStores/*': CMSConfigEdit,
};
export { CMSContentEdit, CMSContentList, CMSConfigList, CMSConfigEdit };
