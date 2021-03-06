import type SvelteCMS from "sveltecms"
import type { ConfigSetting, TypedEntityConfigSetting, ConfigurableEntityConfigSetting, ConfigurableEntityType, FieldableEntity, ConfigurableEntity, FieldableEntityType } from "sveltecms"
import type ContentType from "sveltecms/core/ContentType"
import type Field from "sveltecms/core/Field"

import CMSWidgetFieldgroup from 'sveltecms/widgets/CMSWidgetFieldgroup.svelte'
import CMSWidgetMultiple from 'sveltecms/widgets/CMSWidgetMultiple.svelte'
import CMSWidgetNumber from 'sveltecms/widgets/CMSWidgetNumber.svelte'
import CMSWidgetRange from 'sveltecms/widgets/CMSWidgetRange.svelte'
import CMSWidgetText from 'sveltecms/widgets/CMSWidgetText.svelte'
import CMSWidgetUndefined from 'sveltecms/widgets/CMSWidgetUndefined.svelte'
import CMSWidgetDate from 'sveltecms/widgets/CMSWidgetDate.svelte'
import CMSWidgetTextarea from 'sveltecms/widgets/CMSWidgetTextarea.svelte'
import CMSWidgetCheckbox from 'sveltecms/widgets/CMSWidgetCheckbox.svelte'
import CMSWidgetImage from 'sveltecms/widgets/CMSWidgetImage.svelte'
import CMSWidgetFile from 'sveltecms/widgets/CMSWidgetFile.svelte'
import CMSWidgetSelect from 'sveltecms/widgets/CMSWidgetSelect.svelte'
import CMSWidgetValue from "sveltecms/widgets/CMSWidgetValue.svelte"
import { Entity, type EntityTemplate } from "./EntityTemplate"


export type FormDataHandler = (value:{[key:string]:any}, cms:SvelteCMS, contentType:ContentType, field:Field)=>Promise<any>

export type WidgetConfigSetting = TypedEntityConfigSetting & ConfigurableEntityConfigSetting & {
}

export const templateWidget:EntityTemplate = {
  id: 'widget',
  label: 'Widget',
  labelPlural: 'Widgets',
  description: `Widgets provide form inputs for entering data into fields.`,
  typeField: true,
  typeInherits: true,
  typeRequired: true,
  typeRestricted: true,
  isConfigurable: true,
}

export type WidgetType = ConfigurableEntityType & {
  description: string
  widget: Object // TODO: get svelte component object type
  fieldTypes: string[]
  handlesMultiple?: boolean
  handlesMedia?: boolean
  handlesFields?: boolean
  admin?: boolean
  formDataHandler?:FormDataHandler
}

export class Widget extends Entity implements ConfigurableEntity {
  type: string
  widget: Object
  handlesMultiple: boolean
  handlesMedia: boolean
  handlesFields: boolean
  options?: ConfigSetting
  formDataHandler?:FormDataHandler
  constructor(conf:string|WidgetConfigSetting, cms:SvelteCMS) {
    super(templateWidget)
    // TODO: change per CMSContentField changes
    conf = typeof conf === 'string' ? { type: conf } : conf

    let parent = cms.widgets[conf.type]
    parent = typeof parent === 'string' ? { type: parent } : parent

    // @ts-ignore TODO: figure out how to specify that mergeConfigOptions returns the same type as the parameter
    if (parent) conf = cms.mergeConfigOptions(parent, conf, { type: parent.type })

    let widgetType = cms.widgetTypes[conf['type']]
    this.type = widgetType?.id
    this.widget = widgetType?.widget
    this.handlesMultiple = widgetType?.handlesMultiple || false
    this.handlesMedia = widgetType?.handlesMedia || false
    this.handlesFields = widgetType?.handlesFields || false
    if (widgetType?.formDataHandler) { // formDataHandler can only be set on the widget type
      this.formDataHandler = widgetType.formDataHandler
    }
    if (widgetType?.optionFields) this.options = cms.getInstanceOptions(widgetType, conf)
  }
}

export const widgetTypes:{[key:string]:WidgetType} = {
  undefined: {
    id: 'undefined',
    description: `The Widget that shows up when SvelteCMS can't find the proper Widget.`,
    fieldTypes: [],
    widget: CMSWidgetUndefined,
    admin: true,
  },
  multiple: {
    id: 'multiple',
    description: `The Widget for fields that allow multiple values.`,
    fieldTypes: [],
    widget: CMSWidgetMultiple,
    admin: true,
  },
  text: {
    id: 'text',
    description: `A plain text input.`,
    fieldTypes: ['text','date','number','tags'],
    widget: CMSWidgetText,
    optionFields: {
      placeholder: {
        type: 'text',
        default: '',
        helptext: 'This text will be displayed when the field is empty.',
      }
    }
  },
  fieldgroup: {
    id: 'fieldgroup',
    description: `The Widget for fieldgroups with nested fields.`,
    fieldTypes: ['fieldgroup'],
    handlesFields: true,
    widget: CMSWidgetFieldgroup,
    optionFields: { // TODO: add "fieldgroups" and "fieldgroupTypes" to the options
      oneline: {
        type: 'boolean',
        default: false,
        helptext: 'add the "oneline" class to a fieldgroup fieldset',
      },
    }
  },
  number: {
    id: 'number',
    fieldTypes: ['number','text'],
    description: 'An HTML number input.',
    widget: CMSWidgetNumber,
    optionFields: {
      min: {
        type: 'number',
        default: 0,
        helptext: 'The minimum number allowed on the form. Does not validate form submissions!',
      },
      max: {
        type: 'number',
        default: undefined,
        helptext: 'The maximum number allowed on the form. Does not validate form submissions!',
      },
      step: {
        type: 'number',
        default: 1,
        helptext: 'The amount between each selectable value, e.g. "2" would allow 0,2,4,6.... Does not validate form submissions!',
      },
    }
  },
  range: {
    id: 'range',
    fieldTypes: ['number','text'],
    description: `An HTML range input with a slider.`,
    widget: CMSWidgetRange,
    optionFields: {
      min: {
        type: 'number',
        default: 0,
        helptext: 'The minimum number allowed on the form. Does not validate form submissions!',
      },
      max: {
        type: 'number',
        default: undefined,
        helptext: 'The maximum number allowed on the form. Does not validate form submissions!',
      },
      step: {
        type: 'number',
        default: 1,
        helptext: 'The amount between each selectable value, e.g. "2" would allow 0,2,4,6.... Does not validate form submissions!',
      },
    }
  },
  date: {
    id: 'date',
    fieldTypes: ['text','date'],
    description: `An HTML date input, with options for whether and how to store the time.`,
    widget: CMSWidgetDate,
    optionFields: {
      time: {
        type: 'text',
        default: '',
        helptext: `Whether and how to store the time. Choosing "none" will store only the date
        as yyyy-mm-dd; which is useful when using the date widget with a text field, or as a slug,
        but not useful for saving dates. "Time only" is similar, but stores only a time in hours
        and minutes. Either of the other two will store a full UTC date, including time.
        Sometimes it may be best to hide the time input, e.g. if you are interested only in
        when a piece of content is posted and would like to simplify the form.`,
        widget: {
          type: 'select',
          default: 'editable',
          unset: '- none - ',
          items: {
            'hidden': 'Hidden',
            'editable': 'Editable',
            'timeonly': 'Time only (no date)',
          },
        }
      },
      minDate: {
        type: 'date',
        widget: {
          type: 'date',
          options: {
            time: '',
          }
        },
        default: '',
        helptext: 'The earliest date allowable.',
        hidden: '$equal($values.time,timeonly)',
      },
      maxDate: {
        type: 'date',
        widget: {
          type: 'date',
          options: {
            time: '',
          }
        },
        default: '',
        helptext: 'The latest date allowable.',
        hidden: '$equal($values.time,timeonly)',
      },
      seconds: {
        type: 'boolean',
        default: false,
        label: 'Use seconds',
        helptext: 'Whether to store and keep seconds in the time.',
        hidden: '$not($values.time)'
      },
      minTime: {
        type: 'date',
        widget: {
          type: 'date',
          options: {
            time: 'timeonly',
          }
        },
        default: '',
        helptext: 'The earliest time allowed.',
        hidden: '$not($values.time)'
      },
      maxTime: {
        type: 'date',
        widget: {
          type: 'date',
          options: {
            time: 'timeonly',
          }
        },
        default: '',
        helptext: 'The latest time allowed.',
        hidden: '$not($values.time)'
      },
    },
  },
  textarea: {
    id: 'textarea',
    fieldTypes: ['html','text','tags'],
    description: `An HTML textarea input.`,
    widget: CMSWidgetTextarea,
    optionFields: {
      placeholder: {
        type: 'text',
        default: '',
        helptext: 'This text will be displayed when the field is empty.',
      },
      rows: {
        type: 'number',
        default: 3,
        helptext: 'The height, in "rows", of the textarea element.',
      },
      cols: {
        type: 'number',
        default: 20,
        helptext: 'The width, in "columns", of the textarea element.',
      },
      resize: {
        type: 'text',
        helptext: 'Whether to allow resizing of the textarea element.',
        default: 'none',
        widget: {
          type: 'select',
          options: {
          // @ts-ignore
            items: ['none','both','horizontal','vertical']
          }
        }
      },
      autosize: {
        type: 'boolean',
        default: false,
        helptext: 'If selected, the textarea element will be automatically resized to accommodate the entered text.'
      },
    }
  },
  checkbox: {
    id: 'checkbox',
    fieldTypes: ['boolean'],
    description: `An HTML checkbox form element.`,
    widget: CMSWidgetCheckbox,
    optionFields: {
      labelBeforeCheckbox: {
        type: 'boolean',
        default: false,
        helptext: 'Render the text label before the checkbox element in HTML markup.',
      }
    }
  },
  image: {
    id: 'image',
    fieldTypes: ['image'],
    description: `The default SvelteCMS image input. Handles multiple images with alt and title fields, but no drag and drop.`,
    widget: CMSWidgetImage,
    handlesMultiple: true,
    handlesMedia: true,
    formDataHandler: async (value, cms, contentType, field) => {
      let files = value.files

      let data = []
      Object.entries(value).forEach(([i,obj]) => {
        if (i.match(/^\d+$/)) {
          data.push(obj)
        }
      })

      const promises = data.map(async item => {
        if (item?.filename?.[0]) {
          let file = files.find(f => f.name === item.filename[0])
          if (file) {
            item.src = [ await field.mediaStore.saveMedia(file, field.mediaStore.options) ]
          }
        }
        delete(item.filename)
        item.src = item.src[0]
        item.alt = item?.alt?.[0] ? item.alt[0] : undefined
        item.title = (item?.title?.[0]) ? item.title[0] : undefined
        item.attribution = (item?.attribution?.[0]) ? item.attribution[0] : undefined
        return item
      })
      const result = await Promise.all(promises)

      return result
    },
    optionFields: {
      accept: {
        type: 'tags',
        default: 'image/*',
        helptext: 'A comma-separated list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
      },
      altField: {
        type: 'boolean',
        default: true,
        helptext: 'Show a field for the "alt" attribute'
      },
      altRequired: {
        type: 'boolean',
        default: false,
        helptext: 'Require "alt" attribute'
      },
      titleField: {
        type: 'boolean',
        default: false,
        helptext: 'Show a field for the "title" attribute'
      },
      attributionField: {
        type: 'boolean',
        default: false,
        helptext: 'Show a field for license or attribution of the image'
      },
      attributionRequired: {
        type: 'boolean',
        default: false,
        helptext: 'Require the attribution field',
      },
    },
  },
  file: {
    id: 'file',
    fieldTypes: ['image'],
    description: `The default cms file input. Handles multiple files.`,
    widget: CMSWidgetFile,
    handlesMultiple: true,
    handlesMedia: true,
    optionFields: {
      accept: {
        type: 'text',
        default: undefined,
        helptext: 'A comma-separated list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
      },
      storeStats: {
        type: 'boolean',
        default: undefined,
        helptext: 'Store type, size, and upload date for each file in the database.'
      },
      titleField: {
        type: 'boolean',
        default: false,
        helptext: 'Show a field for the "title" attribute'
      },
      attributionField: {
        type: 'boolean',
        default: false,
        helptext: 'Show a field for license or attribution of the image'
      },
      attributionRequired: {
        type: 'boolean',
        default: false,
        helptext: 'Require the attribution field',
      },
      hideHeader: {
        type: 'boolean',
        default: false,
        helptext: 'Hide the header for the table of files'
      },
    }
  },
  select: {
    id: 'select',
    fieldTypes: ['text','number','date'],
    description: `An HTML select box.`,
    widget: CMSWidgetSelect,
    handlesMultiple: true,
    optionFields: {
      size: {
        type: 'number',
        widget: 'text',
        default: 0,
        helptext: 'The maximum number of items shown in the dropdown area of a select box.'
      },
      unset: {
        type: 'text',
        default: '',
        helptext: 'The title text to use for a blank entry. If this is provided, or if the field is not required, a blank value will be available. The default title for the blank value is "- none -".'
      },
      items: { // TODO: replace this with a List widget when one is available
        type: 'fieldgroup',
        helptext: '',
        multiple: true,
        default: {},
        widget: {
          type: 'fieldgroup',
          options: {
            oneline: true
          }
        },
        fields: {
          label: {
            type: 'text',
            required: true,
            default: '',
            helptext: 'The label for the select option, shown to users.',
          },
          value: {
            type: 'text',
            default: '',
            helptext: 'The value saved to the database.'
          }
        }
      },
    }
  },
  value: {
    id:'value',
    description: 'A hidden html input element holding a value.',
    fieldTypes: [],
    widget: CMSWidgetValue,
  },
  // {
  //   id: 'options', // i.e. radios or checkboxes
  //   fieldTypes: 'text,number,date',
  //   handlesMultiple: true,
  // },
  // {
  //   id: 'tags',
  //   fieldTypes: 'tags', // We need a good widget for tag handling, like Select2
  //   handlesMultiple: true,
  // },
}

export default Widget