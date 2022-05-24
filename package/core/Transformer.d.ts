import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "sveltecms";
export declare type TransformerConfigSetting = ConfigurableEntityConfigSetting;
export declare type Transformer = ConfigurableEntityType & {
    fn: (value: any, opts?: ConfigSetting) => any;
};
export declare const transformers: {
    [id: string]: Transformer;
};
export default Transformer;
