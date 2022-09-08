import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "..";
export declare type TransformerConfigSetting = ConfigurableEntityConfigSetting;
export declare const templateTransformer: {
    id: string;
    label: string;
    labelPlural: string;
    description: string;
    typeField: boolean;
    typeInherits: boolean;
    typeRestricted: boolean;
    isConfigurable: boolean;
};
export declare type Transformer = ConfigurableEntityType & {
    description: string;
    fn: (value: any, opts?: ConfigSetting) => any;
};
export declare const transformers: {
    [id: string]: Transformer;
};
export default Transformer;
