import type {
  SvelteCMSFieldTypeConfig,
  SvelteCMSWidgetTypeConfig,
} from './global'

export const fieldTypes:{[key:string]:SvelteCMSFieldTypeConfig} = {
  text: {
    defaultValue: '',
    defaultWidget: './widgets/CMSWidgetText',
    defaultTransform: v => v.toString()
  },
  date: {
    defaultValue: new Date(),
    defaultWidget: './widgets/CMSWidgetDate',
    defaultTransform: v => new Date(v)
  },
  image: {
    defaultValue: { src:'' },
    defaultWidget: './widgets/CMSWidgetImage',
    defaultTransform: v => { return { src:v }}
  },
  html: {
    defaultValue: '',
    defaultWidget: './widgets/CMSWidgetEditorJS'
  },
  collection: {
    defaultValue: {},
    defaultWidget: './widgets/CMSWidgetCollection'
  },
  number: {
    defaultValue: 0,
    defaultWidget: './widgets/CMSWidgetNumber',
    defaultTransform: v => parseInt(v)
  },
  float: {
    defaultValue: '',
    defaultWidget: './widgets/CMSWidgetText',
    defaultTransform: v => parseFloat(v)
  },
  markdown: {
    defaultValue: '',
    defaultWidget: './widgets/CMSWidgetMarkdown',
    defaultTransform: v => v.toString()
  },
}

export const widgetTypes:{[key:string]:SvelteCMSWidgetTypeConfig} = {
  './widgets/CMSWidgetText': {
    fieldTypes: 'text,date,number',
  },
  './widgets/CMSWidgetTextarea': {
    fieldTypes: 'text,date,number,html,markdown',
  },
  './widgets/CMSWidgetDate': {
    fieldTypes: 'text,date',
  },
  './widgets/CMSWidgetImage': {
    fieldTypes: 'image',
  },
  './widgets/CMSWidgetCollection': {
    fieldTypes: 'collection',
  },
  './widgets/CMSWidgetNumber': {
    fieldTypes: 'number,text'
  },
  './widgets/CMSWidgetRange': {
    fieldTypes: 'number,text'
  },
  './widgets/CMSWidgetSelect': {
    fieldTypes: 'text,number,date',
  },
  './widgets/CMSWidgetCheckboxes': {
    fieldTypes: 'text,number,date',
  },
  './widgets/CMSWidgetRadios': {
    fieldTypes: 'text,number,date,',
  },
  './widgets/CMSWidgetMarkdown': {
    fieldTypes: 'text,html,markdown'
  },
}
