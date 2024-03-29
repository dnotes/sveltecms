import * as components from './components';
import { adminPages } from '../../core/AdminPage';
import CMSWidgetEntity from './widgets/CMSWidgetEntity.svelte';
import CMSWidgetEntityList from './widgets/CMSWidgetEntityList.svelte';
import CMSWidgetList from './widgets/CMSWidgetList.svelte';
import CMSWidgetDefaultValue from './widgets/CMSWidgetDefaultValue.svelte';
export const adminPlugin = {
    id: 'admin',
    components: Object.entries(components).map(([id, component]) => ({ id, component, admin: true })),
    adminPages,
    fieldTypes: [
        {
            id: 'list',
            admin: true,
            default: undefined,
            multiple: true,
            widget: 'list',
            displays: 'none',
        },
        {
            id: 'entity',
            admin: true,
            default: undefined,
            widget: 'entity',
            displays: 'none',
        },
        {
            id: 'entityList',
            admin: true,
            default: undefined,
            widget: 'entityList',
            displays: 'none',
        },
        {
            id: 'defaultValue',
            admin: true,
            default: undefined,
            widget: 'defaultValue',
            displays: 'none',
        }
    ],
    widgetTypes: [
        {
            id: 'list',
            fieldTypes: ['list'],
            admin: true,
            description: `Form element for the configuration of an ad-hoc list of key:value pairs. ` +
                `Useful for providing items to select boxes, for example.`,
            handlesMultiple: true,
            widget: CMSWidgetList,
        },
        {
            id: 'entity',
            fieldTypes: ['entity'],
            admin: true,
            description: `Form element for the configuration for a single entity.`,
            handlesMultiple: true,
            widget: CMSWidgetEntity,
            optionFields: {
                entityType: {
                    type: 'text',
                    required: true,
                    default: '',
                    scriptable: true,
                    helptext: 'The type of entity to be configured.',
                },
                fieldType: {
                    type: 'text',
                    default: '',
                    scriptable: true,
                    helptext: 'The field type for which a widget will be chosen. Only used when Entity Type is "widget".',
                },
            }
        },
        {
            id: 'entityList',
            fieldTypes: ['entityList'],
            admin: true,
            description: `List element for the configuration of a collection of entities.`,
            widget: CMSWidgetEntityList,
            optionFields: {
                entityType: {
                    type: 'text',
                    required: true,
                    default: 'field',
                    scriptable: true,
                    helptext: 'The type of entity to be configured.',
                },
            }
        },
        {
            id: 'defaultValue',
            fieldTypes: ['defaultValue'],
            admin: true,
            description: 'Widget for inputting the default value of a field',
            widget: CMSWidgetDefaultValue,
        }
    ]
};
export default adminPlugin;
