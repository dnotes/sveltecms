import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "sveltecms";
export declare type TransformerConfigSetting = ConfigurableEntityConfigSetting;
export declare const templateTransformer: {
    id: string;
    label: string;
    labelPlural: string;
    typeField: boolean;
    typeInherits: boolean;
    typeRestricted: boolean;
    isConfigurable: boolean;
};
export declare type Transformer = ConfigurableEntityType & {
    fn: (value: any, opts?: ConfigSetting) => any;
};
export declare const transformers: {
    [id: string]: Transformer;
};
export default Transformer;
