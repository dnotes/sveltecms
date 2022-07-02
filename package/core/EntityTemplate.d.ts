import type { ConfigFieldConfigSetting } from "./Field";
export declare type EntityTemplate = {
    id: string;
    label: string;
    labelPlural: string;
    description: string;
    typeField: string | boolean;
    typeInherits?: boolean;
    typeRequired?: boolean;
    typeRestricted?: boolean;
    isConfigurable?: boolean;
    listFields?: string[];
    isFieldable?: boolean;
    scriptableProps?: string[];
    configFields?: {
        [id: string]: ConfigFieldConfigSetting;
    };
};
export declare class Entity {
    template?: EntityTemplate;
    constructor(template: EntityTemplate);
}
