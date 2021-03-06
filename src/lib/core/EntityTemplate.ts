import type { ConfigSetting } from "sveltecms"
import type { ConfigFieldConfigSetting, FieldConfigSetting } from "./Field"

export type EntityTemplate = {
  id:string     // The ID for the template, i.e. the lowercase name of the class, like "widget"
  label:string, // The label for the Entity Type, like "Widget"
  labelPlural:string,         // Plural form of the Entity Type label
  description:string,         // A brief description of the Entity Type
  typeField:string|boolean,   // Whether the field has a "type" field. If true, a "type" field will be created. If a string is specified, which configField should be considered the "type" field, e.g. for SlugConfig.
  typeInherits?:boolean,      // Whether the "type" inherits properties and options from its parent
  typeRequired?:boolean,      // Whether a "type" is required for entities of this Entity Type
  typeRestricted?:boolean,    // Whether the "type" is restricted to existing entity ids (e.g. Fields, Widgets) or can be anything (e.g. Fieldgroups)
  isConfigurable?:boolean,    // Whether the Entity Type allows optionFields for configuration
  listFields?:string[],       // Which fields should be displayed in entity list views
  isFieldable?:boolean,       // Whether the Entity Type allows fields
  scriptableProps?: string[], // Which properties are scriptable (TODO: make this a prop on ConfigFieldConfigSetting)
  // adminFieldgroup?: string,
  configFields?: {            // The fields used to configure the Entity Type
    [id:string]:ConfigFieldConfigSetting
  }
}

export class Entity {
  template?:EntityTemplate
  constructor(template:EntityTemplate) { this.template = template }
}

// TODO: plans for the future

// export type EntityTypedInheriting = Entity & {
//   _parent?:EntityTypedInheriting
// }

// export type EntityConfigurable = Entity & {
//   optionFields?:{[id:string]:ConfigFieldConfigSetting}
//   options?:ConfigSetting
// }

// export type EntityLabeled = {
//   label:string
// }

// export type EntityFieldableConfig = {
//   fields?:{[id:string]:FieldConfigSetting}
// }

