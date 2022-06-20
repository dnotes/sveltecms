export class Entity {
    constructor(template) { this.template = template; }
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
