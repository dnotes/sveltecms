import type { FieldableEntityConfigSetting, EntityType, FieldableEntity } from "sveltecms";
import type SvelteCMS from "sveltecms";
import { Entity, type EntityTemplate } from "./EntityTemplate";
import Field, { type ConfigFieldConfigSetting } from "./Field";
export declare type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & {
    admin?: boolean;
    type?: string;
};
export declare type AdminFieldgroupConfigSetting = FieldgroupConfigSetting & {
    admin: true;
    fields: {
        [id: string]: ConfigFieldConfigSetting;
    };
};
export declare const templateFieldgroup: EntityTemplate;
export declare class Fieldgroup extends Entity implements EntityType, FieldableEntity {
    template: EntityTemplate;
    id: string;
    type: string;
    admin?: boolean;
    plugin?: string;
    isFieldable: boolean;
    fields: {
        [id: string]: Field;
    };
    constructor(conf: string | FieldgroupConfigSetting, cms: SvelteCMS);
}
export declare type AdminFieldgroup = Fieldgroup & {
    admin: true;
};
export default Fieldgroup;
