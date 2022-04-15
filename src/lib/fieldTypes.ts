import type { CMSFieldType } from '.'

const fieldTypes:{[key:string]:CMSFieldType} = {
  text: {
    id: 'text',
    defaultValue: '',
    defaultWidget: 'text',
    defaultPreSave: ['toString'],
  },
  date: {
    id: 'date',
    defaultValue: new Date(),
    defaultWidget: 'date',
    defaultPreSave: ['date'],
  },
  image: {
    id: 'image',
    defaultValue: [],
    defaultWidget: 'image',
  },
  file: {
    id: 'file',
    defaultValue: [],
    defaultWidget: 'file',
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
  boolean: {
    id: 'boolean',
    defaultValue: null,
    defaultWidget: 'checkbox',
    defaultPreSave: ['boolean'],
  },
  cmsfield: {
    id: 'cmsfield',
    defaultValue: null,
    defaultWidget: 'collection',
    hidden: true,
  },
  tags: {
    id: 'tags',
    defaultValue: [],
    defaultWidget: 'text', // @todo: add tags widget
    defaultPreSave: ['tags']
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