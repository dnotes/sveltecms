import CMSWidgetCollection from './widgets/CMSWidgetCollection.svelte'
import CMSWidgetMultiple from './widgets/CMSWidgetMultiple.svelte'
import CMSWidgetNumber from './widgets/CMSWidgetNumber.svelte'
import CMSWidgetRange from './widgets/CMSWidgetRange.svelte'
import CMSWidgetText from './widgets/CMSWidgetText.svelte'
import CMSWidgetUndefined from './widgets/CMSWidgetUndefined.svelte'
import CMSWidgetDate from './widgets/CMSWidgetDate.svelte'

import type { SvelteCMSWidgetType } from './global'

const widgetTypes:{[key:string]:SvelteCMSWidgetType} = {
  undefined: {
    id: 'undefined',
    fieldTypes: [],
    widget: CMSWidgetUndefined,
    hidden: true,
  },
  multiple: {
    id: 'multiple',
    fieldTypes: [],
    widget: CMSWidgetMultiple,
    hidden: true,
  },
  text: {
    id: 'text',
    fieldTypes: ['text','date','number'],
    widget: CMSWidgetText,
    optionFields: {
      placeholder: {
        type: 'text',
        default: '',
      }
    }
  },
  collection: {
    id: 'collection',
    fieldTypes: ['collection'],
    widget: CMSWidgetCollection,
    optionFields: {
      fields: {
        type: 'cmsfield',
        multiple: true,
        default: {}
      }
    }
  },
  number: {
    id: 'number',
    fieldTypes: ['number','text'],
    widget: CMSWidgetNumber,
    optionFields: {
      min: {
        type: 'number',
        default: 0,
      },
      max: {
        type: 'number',
        default: undefined,
      },
      step: {
        type: 'number',
        default: 1,
      },
    }
  },
  range: {
    id: 'range',
    fieldTypes: ['number','text'],
    widget: CMSWidgetRange,
    optionFields: {
      min: {
        type: 'number',
        default: 0,
      },
      max: {
        type: 'number',
        default: undefined,
      },
      step: {
        type: 'number',
        default: 1,
      },
    }
  },
  // {
  //   id: 'textarea',
  //   fieldTypes: 'text,date,number,html,markdown',
  // },
  date: {
    id: 'date',
    fieldTypes: ['text','date'],
    widget: CMSWidgetDate,
    optionFields: {
      min: {
        type: 'date',
        default: undefined,
      },
      max: {
        type: 'date',
        default: undefined,
      },
    }
  },
  // {
  //   id: './widgets/CMSWidgetImage',
  //   fieldTypes: 'image',
  // },
  // {
  //   id: './widgets/CMSWidgetCollection',
  //   fieldTypes: 'collection',
  // },
  // {
  //   id: './widgets/CMSWidgetSelect',
  //   fieldTypes: 'text,number,date',
  //   handlesMultiple: true,
  // },
  // {
  //   id: './widgets/CMSWidgetCheckboxes',
  //   fieldTypes: 'text,number,date',
  //   handlesMultiple: true,
  // },
  // {
  //   id: './widgets/CMSWidgetRadios',
  //   fieldTypes: 'text,number,date',
  // },
  // {
  //   id: './widgets/CMSWidgetTags',
  //   fieldTypes: 'tags',
  //   handlesMultiple: true,
  // },
  // {
  //   id: './widgets/CMSWidgetMarkdown',
  //   fieldTypes: 'text,html,markdown'
  // },
}

export default widgetTypes