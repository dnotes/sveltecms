import CMSWidgetCollection from './widgets/CMSWidgetCollection.svelte'
import CMSWidgetMultiple from './widgets/CMSWidgetMultiple.svelte'
import CMSWidgetNumber from './widgets/CMSWidgetNumber.svelte'
import CMSWidgetRange from './widgets/CMSWidgetRange.svelte'
import CMSWidgetText from './widgets/CMSWidgetText.svelte'
import CMSWidgetUndefined from './widgets/CMSWidgetUndefined.svelte'
import CMSWidgetDate from './widgets/CMSWidgetDate.svelte'
import CMSWidgetTextarea from './widgets/CMSWidgetTextarea.svelte'
import CMSWidgetCheckbox from './widgets/CMSWidgetCheckbox.svelte'
import CMSWidgetImage from './widgets/CMSWidgetImage.svelte'
import CMSWidgetFile from './widgets/CMSWidgetFile.svelte'
import CMSWidgetSelect from './widgets/CMSWidgetSelect.svelte'

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
      oneline: {
        type: 'boolean',
        default: false,
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
  textarea: {
    id: 'textarea',
    fieldTypes: ['html','text','tags'],
    widget: CMSWidgetTextarea,
    optionFields: {
      placeholder: {
        type: 'text',
        default: '',
      },
      rows: {
        type: 'number',
        default: undefined,
        widgetOptions: {
          min: 0,
        }
      },
      cols: {
        type: 'number',
        default: 20,
      },
      resize: {
        type: 'text',
        default: undefined,
        widget: 'select',
        widgetOptions: {
          options: ['none','both','horizontal','vertical']
        }
      },
      autosize: {
        type: 'boolean',
        default: false,
      },
    }
  },
  checkbox: {
    id: 'checkbox',
    fieldTypes: ['boolean'],
    widget: CMSWidgetCheckbox,
  },
  image: {
    id: 'image',
    fieldTypes: ['image'],
    widget: CMSWidgetImage,
    handlesMultiple: true,
    handlesMedia: true,
    optionFields: {
      accept: {
        type: 'text',
        default: 'image/*',
        description: 'A comma-separated list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
      },
      altField: {
        type: 'boolean',
        default: true,
        description: 'Show a field for the "alt" attribute'
      },
      altRequired: {
        type: 'boolean',
        default: false,
        description: 'Require "alt" attribute'
      },
      titleField: {
        type: 'boolean',
        default: false,
        description: 'Show a field for the "title" attribute'
      },
      createThumbnail: {
        type: 'boolean',
        default: false,
        description: 'Create a thumbnail from the image when saving, and allow editor to set the crop coordinates'
      },
      thumbnailHeight: {
        type: 'number',
        default: 200,
      },
      thumbnailWidth: {
        type: 'number',
        default: 200,
      },
    },
  },
  file: {
    id: 'file',
    fieldTypes: ['image'],
    widget: CMSWidgetFile,
    handlesMultiple: true,
    handlesMedia: true,
    optionFields: {
      accept: {
        type: 'text',
        default: undefined,
        description: 'A comma-separated list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
      }
    }
  },
  select: {
    id: 'select',
    fieldTypes: ['text','number','date'],
    widget: CMSWidgetSelect,
    handlesMultiple: true,
    optionFields: {
      size: {
        type: 'number',
        widget: 'text',
        default: 0,
      },
      options: {
        type: 'collection',
        multiple: true,
        default: {},
        widgetOptions: {
          oneline: true,
        },
        fields: {
          label: {
            type: 'text',
            required: true,
            default: '',
          },
          value: {
            type: 'text',
            default: '',
          }
        }
      },
    }
  }
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