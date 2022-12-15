import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "..";
export type TransformerConfigSetting = ConfigurableEntityConfigSetting;
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
export type Transformer = ConfigurableEntityType & {
    description: string;
    fn: (value: any, opts?: ConfigSetting) => any;
};
export declare const transformers: {
    [id: string]: Transformer;
};
export default Transformer;
