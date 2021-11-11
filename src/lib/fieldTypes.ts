import type { SvelteCMSFieldType } from './global'

const fieldTypes:{[key:string]:SvelteCMSFieldType} = {
  text: {
    id: 'text',
    defaultValue: '',
    defaultWidget: 'text',
    defaultPreSave: ['toString'],
    defaultPreMount: ['html'],
  },
  date: {
    id: 'date',
    defaultValue: new Date(),
    defaultWidget: 'date',
    defaultPreSave: ['date'],
  },
  image: {
    id: 'image',
    defaultValue: null,
    defaultWidget: 'image',
  },
  html: {
    id: 'html',
    defaultValue: '',
    defaultWidget: 'textarea',
    defaultPreMount: ['html'],
  },
  collection: {
    id: 'collection',
    defaultValue: {},
    defaultWidget: 'collection',
  },
  number: {
    id: 'number',
    defaultValue: null,
    defaultWidget: 'number',
    defaultPreSave: ['parseInt'],
  },
  float: {
    id: 'float',
    defaultValue: null,
    defaultWidget: 'text',
    defaultPreSave: ['parseFloat'],
  },
  markdown: {
    id: 'markdown',
    defaultValue: '',
    defaultWidget: 'markdown',
    defaultPreSave: ['toString'],
  },
  boolean: {
    id: 'boolean',
    defaultValue: null,
    defaultWidget: 'checkbox',
    defaultPreSave: ['boolean'],
  },
  choice: {
    id: 'choice',
    defaultValue: null,
    defaultWidget: 'select',
    defaultPreMount: ['html']
  },
  cmsfield: {
    id: 'cmsfield',
    defaultValue: null,
    defaultWidget: 'collection',
    hidden: true,
  },
  // password: {
  //   id: 'password',
  //   defaultValue: null,
  //   defaultWidget: 'password',
  //   defaultPreMount: ['delete'],
  //   defaultPreSave: ['saltandhash'],
  // },
}

export default fieldTypes