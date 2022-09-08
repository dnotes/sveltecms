import type { FieldableEntityConfigSetting, EntityType, FieldableEntity, DisplayableEntity, DisplayableEntityConfigSetting } from "..";
import type SvelteCMS from "..";
import type { EntityDisplayConfigSetting } from "./Display";
import type { EntityTemplate } from "./EntityTemplate";
import Field, { type ConfigFieldConfigSetting } from "./Field";
export declare type FieldgroupConfigSetting = FieldableEntityConfigSetting & EntityType & DisplayableEntityConfigSetting & {
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
export declare class Fieldgroup implements EntityType, FieldableEntity, DisplayableEntity {
    id: string;
    type: string;
    admin?: boolean;
    plugin?: string;
    displays: EntityDisplayConfigSetting;
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
