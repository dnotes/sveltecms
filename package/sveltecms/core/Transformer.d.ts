import type { ConfigurableEntityType, ConfigSetting, ConfigurableEntityConfigSetting } from "../..";
import type { EntityTemplate } from "./EntityTemplate";
export type TransformerConfigSetting = ConfigurableEntityConfigSetting;
export declare const templateTransformer: EntityTemplate;
export type Transformer = ConfigurableEntityType & {
    description: string;
    fn: (value: any, opts?: ConfigSetting) => any;
};
export declare const transformers: {
    [id: string]: Transformer;
};
export default Transformer;
