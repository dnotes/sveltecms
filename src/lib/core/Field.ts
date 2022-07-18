import type SvelteCMS from 'sveltecms'
import type { LabeledEntity, TypedEntity, EntityType, ConfigSetting, FieldableEntity } from "sveltecms"
import type { TransformerConfigSetting } from "sveltecms/core/Transformer"
import type ContentType from 'sveltecms/core/ContentType'
import MediaStore, { type MediaStoreConfigSetting } from "sveltecms/core/MediaStore"
import { parseScript, type ScriptFunctionConfigSetting, ScriptFunctionConfig } from 'sveltecms/core/ScriptFunction'
import Widget, { type WidgetConfigSetting } from 'sveltecms/core/Widget'
import { Display, type DisplayConfigSetting } from './Display'

import { getLabelFromID, splitTags } from 'sveltecms/utils'
import { Entity, type EntityTemplate } from './EntityTemplate'

export type FieldConfigSetting = {
  type: string
  label?: string|ScriptFunctionConfigSetting
  default?: any
  // value?: any
  helptext?: string|ScriptFunctionConfigSetting
  required?: boolean|ScriptFunctionConfigSetting
  disabled?: boolean|ScriptFunctionConfigSetting
  hidden?: boolean|ScriptFunctionConfigSetting
  multiple?: boolean|ScriptFunctionConfigSetting
  multipleOrSingle?:boolean
  multipleLabelFields?: string|string[]|ScriptFunctionConfigSetting
  // multipleMin?: number|ScriptFunctionConfigSetting
  // multipleMax?: number|ScriptFunctionConfigSetting
  fields?: {[key:string]:string|FieldConfigSetting}
  widget?: string|WidgetConfigSetting
  display?: string|false|DisplayConfigSetting
  // validator?: Rules // TODO
  preSave?: string|TransformerConfigSetting|(string|TransformerConfigSetting)[]
  preMount?: string|TransformerConfigSetting|(string|TransformerConfigSetting)[]
  class?: string
  events?: {on:string,function:ScriptFunctionConfigSetting}|{on:string,function:ScriptFunctionConfigSetting}[]
  mediaStore?: string|MediaStoreConfigSetting
  [id:string]:string|number|boolean|ConfigSetting|ScriptFunctionConfigSetting|(string|number|ConfigSetting)[]
}

export type ConfigFieldConfigSetting = FieldConfigSetting & {
  type: 'text'|'number'|'boolean'|'date'|'fieldgroup'|'tags'|'entity'|'entityList'
  entity?: string
  default: any
  helptext: string
  fields?: {[key:string]:ConfigFieldConfigSetting}
}

export type FieldType = EntityType & {
  default: any
  widget: string|WidgetConfigSetting
  display: string|DisplayConfigSetting
  preSave?: Array<string|TransformerConfigSetting>
  preMount?: Array<string|TransformerConfigSetting>
  admin?: boolean
}

export const templateField:EntityTemplate = {
  id: 'field',
  label: 'Field',
  labelPlural: 'Fields',
  description: `Fields are the basic data structures of SvelteCMS, used to compose Content Types and Fieldgroups. Each field stores a particular type of data, which is input using an applicable Widget.`,
  typeField: true,
  typeInherits: true,
  typeRequired: true,
  typeRestricted: true,
  isConfigurable: true,
  isFieldable: true,
  listFields: ['widget'],
  scriptableProps:[
    'label','helptext','default',
    'multiple','multipleLabelFields','multipleMin','multipleMax',
    'required','disabled','hidden','class'
  ],
  configFields: {
    label: {
      type:'text',
      default:'',
      helptext: 'The label for the field.'
    },
    widget: {
      type:'entity',
      default:'',
      helptext:'The form widget used for data input for this field.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'widget',
          fieldType: {
            function: 'getValue',
            params: ['type'],
          }
        },
      }
    },
    display: {
      type:'entity',
      default:'',
      helptext:'The element or component used to display this field.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'display',
        },
      }
    },
    mediaStore: {
      type:'entity',
      default:'',
      helptext:'Where any media uploaded to this field will be stored. Only applies if the widget handles media.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'mediaStore',
        },
      }
    },
    helptext: {
      type: 'text',
      default: '',
      helptext: 'The help text to describe the purpose of the field for content editors.'
    },
    class: {
      type: 'text',
      default: '',
      helptext: 'Any classes to add to the form and display.'
    },
    required: {
      type: 'boolean',
      default: false,
      helptext: 'Whether the field is required.'
    },
    hidden: {
      type: 'boolean',
      default: false,
      helptext: 'Whether the field is hidden.'
    },
    disabled: {
      type: 'boolean',
      default: false,
      helptext: 'Whether the field is disabled.'
    },
    multiple: {
      type: 'boolean',
      default: false,
      helptext: 'Whether the field takes multiple values.'
    },
    multipleOrSingle: {
      type: 'boolean',
      default: false,
      helptext: 'Whether the field will allow storing a single value instead of a single-item array.',
      hidden: '$not($values.multiple)',
    },
    // multipleMin: {
    //   type: 'number',
    //   default: undefined,
    //   helptext: 'The minimum number of values for a multiple field.',
    //   hidden: '$not($values.multiple)',
    // },
    // multipleMax: {
    //   type: 'number',
    //   default: undefined,
    //   helptext: 'The maximum number of values for a multiple field.',
    //   hidden: '$not($values.multiple)',
    // },
    multipleLabelFields: {
      type: 'text',
      default: '',
      helptext: 'For fieldgroups, the fields to concatenate when creating a label for each item.',
      hidden: '$not($values.multiple)',
    },
    preSave: {
      type: 'entity',
      multiple: true,
      multipleOrSingle: true,
      default: [],
      helptext: 'Any transformers to apply before the field is saved to storage.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'transformer',
        }
      }
    },
    preMount: {
      type: 'entity',
      multiple: true,
      multipleOrSingle: true,
      default: [],
      helptext: 'Any transformers to apply before the field is displayed on the page.',
      widget: {
        type: 'entity',
        options: {
          entityType: 'transformer',
        }
      }
    },

  }
}

export class Field extends Entity implements FieldableEntity, TypedEntity, LabeledEntity {
  id: string
  type: string
  template:EntityTemplate = templateField

  // should be implemented by every widget
  label: string|ScriptFunctionConfig
  helptext?: string|ScriptFunctionConfig = ''
  required?: boolean|ScriptFunctionConfig
  disabled?: boolean|ScriptFunctionConfig

  // should be implemented by the CMS
  hidden?: boolean|ScriptFunctionConfig
  class: string|ScriptFunctionConfig = ''
  default?: any
  value?: any
  events?: {on:string,function:ScriptFunctionConfig}[]

  // implemented only in Multiple and Fieldgroup widgets
  // implement as needed in custom widgets
  multiple?: boolean|ScriptFunctionConfig
  multipleOrSingle?: boolean
  multipleLabelFields?: string|string[]|ScriptFunctionConfig
  multipleMin?: number|ScriptFunctionConfig
  multipleMax?: number|ScriptFunctionConfig

  // not implemented in widgets
  // validator?: Rules
  fields?: {[key:string]:Field}
  widget: Widget
  display?: Display
  preSave?: (string|TransformerConfigSetting)[]
  preMount?: (string|TransformerConfigSetting)[]
  mediaStore?: MediaStore

  // Items that are only used when initialized for an entry form
  values: {[key:string]:any} = {} // all form values
  errors: {[key:string]:any} = {} // all form errors
  touched: {[key:string]:any} = {} // all touched form elements
  constructor(id, conf:string|FieldConfigSetting, cms:SvelteCMS, contentType?:ContentType) {
    super(templateField)

    // Set the field's id. This identifies the instance, not the field type;
    // in values objects, the key would be this id, e.g. values[id] = 'whatever'
    this.id = id

    // Sort out the type first, because if it doesn't exist that's an error
    conf = typeof conf === 'string' ? { type: conf } : conf
    let field = cms.fields[conf.type]
    field = typeof field === 'string' ? { type:field } : field

    // @ts-ignore TODO with widget
    if (field) conf = cms.mergeConfigOptions(field, conf, { type: field.type })

    if (typeof conf !== 'string') { // Always true; see above. TODO: figure out how to change type mid-function, and remove if statement
      let fieldType = cms.fieldTypes?.[conf.type]
      if (!fieldType) throw new Error(`SvelteCMS: field type "${conf.type}" does not exist`)
      this.type = conf.type
      this.label = parseScript(conf.label) ?? (typeof conf.label === 'string' ? conf.label : getLabelFromID(id)) // text is required
      this.value = parseScript(conf.value) ?? conf.value
      this.helptext = parseScript(conf.value) ?? (typeof conf.helptext === 'string' ? conf.helptext : '')
      this.multiple = parseScript(conf.multiple) ?? (conf.multiple ? true : false)
      this.multipleLabelFields = parseScript(conf.multipleLabelFields) ?? conf.multipleLabelFields
      this.multipleOrSingle = conf.multipleOrSingle ?? false
      this.multipleMin = parseScript(conf.multipleMin) ?? (isNaN(Number(conf.multipleMin)) ? undefined : Number(conf.multipleMin))
      this.multipleMax = parseScript(conf.multipleMax) ?? (isNaN(Number(conf.multipleMax)) ? undefined : Number(conf.multipleMax))

      if (conf.events) {
        if (!Array.isArray(conf.events)) conf.events = [conf.events]
        this.events = conf.events.map(e => {
          return { on: e.on, function: parseScript(e.function) }
        }).filter(e => e.on && e.function)
      }

      this.default = parseScript(conf.default) ?? conf.default ?? fieldType.default
      this.required = parseScript(conf.required) ?? (typeof conf.required === 'boolean' ? conf.required : false)
      this.disabled = parseScript(conf.disabled) ?? (typeof conf.disabled === 'boolean' ? conf.disabled : false)
      this.hidden = parseScript(conf.hidden) ?? (typeof conf.hidden === 'boolean' ? conf.hidden : false)
      this.widget = new Widget(conf.widget || fieldType.widget, cms)
      if (conf.display || fieldType.display) this.display = new Display(conf?.['display'] ?? fieldType.display, cms)

      // this.validator = conf.validator ?? fieldType.defaultValidator
      this.preSave = conf.preSave ? ( Array.isArray(conf.preSave) ? conf.preSave : [conf.preSave] ) : fieldType.preSave
      this.preMount = conf.preMount ? ( Array.isArray(conf.preMount) ? conf.preMount : [conf.preMount] ) : fieldType.preMount
      this.class = parseScript(conf.class) ?? (typeof conf.class === 'string' ? conf.class : '')
      if (conf.fields) {
        this.fields = {}
        Object.entries(conf.fields).forEach(([id, conf]) => {
          if (id.match(/^[a-zA-Z0-9]\w*$/)) this.fields[id] = new Field(id, conf, cms, contentType)
        })
      }
      if (this.widget.handlesMedia) {
        this.mediaStore = new MediaStore((conf?.['mediaStore'] || contentType?.mediaStore || cms.defaultMediaStore), cms)
      }
    }
  }

  get isFieldable():boolean { return this.widget.handlesFields }

}

export const fieldTypes:{[key:string]:FieldType} = {
  text: {
    id: 'text',
    default: '',
    widget: 'text',
    display: 'span',
    preSave: ['toString'],
  },
  date: {
    id: 'date',
    default: '',
    widget: 'date',
    display: 'span',
    preSave: ['date'],
  },
  image: {
    id: 'image',
    default: [],
    widget: 'image',
    display: 'field_image',
  },
  file: {
    id: 'file',
    default: [],
    widget: 'file',
    display: 'field_file',
  },
  html: {
    id: 'html',
    default: '',
    widget: 'textarea',
    display: {
      type: 'div',
      html: true
    },
    preMount: ['html'],
  },
  fieldgroup: {
    id: 'fieldgroup',
    default: {},
    widget: 'fieldgroup',
    display: 'field_fieldgroup',
  },
  number: {
    id: 'number',
    default: undefined,
    widget: 'number',
    display: 'span',
    preSave: ['parseInt'],
  },
  float: {
    id: 'float',
    default: undefined,
    widget: 'text',
    display: 'span',
    preSave: ['parseFloat'],
  },
  boolean: {
    id: 'boolean',
    default: undefined,
    widget: 'checkbox',
    display: 'boolean',
    preSave: ['boolean'],
  },
  tags: {
    id: 'tags',
    default: [],
    widget: 'text', // @todo: add tags widget
    display: {
      type: 'li',
      wrapper: 'ul',
    },
    preSave: ['tags']
  },
  value: {
    id: 'value',
    default: undefined,
    widget: 'value',
    display: '',
  },
  // password: {
  //   id: 'password',
  //   default: null,
  //   widget: 'password',
  //   preMount: ['delete'],
  //   preSave: ['saltandhash'],
  // },
}

export default Field
