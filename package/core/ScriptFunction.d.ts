import type { ConfigurableEntity, ConfigurableEntityType } from "..";
import type SvelteCMS from '..';
import type Field from './Field';
import type { EntityTemplate } from "./EntityTemplate";
export declare const templateScriptFunction: EntityTemplate;
export declare class ScriptFunction implements ConfigurableEntity {
    id: string;
    fn: (vars: ScriptVars, options: {
        [key: string]: any;
    }) => any;
    vars: ScriptVars;
    options: {
        [key: string]: string | number | boolean | null | undefined;
    };
    constructor(conf: string | ScriptFunctionConfig, vars: ScriptVars);
    run(): void;
}
export declare class ScriptError extends Error {
    state: string;
    tail: string;
    constructor(message: string, state: string, tail?: string);
}
/**
 * These variables are available to all Script Functions as they are run.
 */
export type ScriptVars = {
    cms: SvelteCMS;
    field: Field;
    values: any;
    errors: any;
    touched: any;
    path?: string;
    id: string;
};
export type ScriptFunctionType = ConfigurableEntityType & {
    admin?: boolean;
    description: string;
    fn: (vars: ScriptVars & {
        cms: SvelteCMS;
    }, opts: {
        [key: string]: any;
    }, event?: Event, el?: HTMLElement) => any;
};
export type ScriptFunctionConfigSetting = string | {
    function?: string;
    fn?: string;
    params: (string | number | boolean | null | ScriptFunctionConfigSetting)[];
};
export declare class ScriptFunctionConfig {
    function: string;
    params: (string | number | boolean | null | ScriptFunctionConfig)[];
    constructor(conf?: ScriptFunctionConfig);
    get alias(): any;
    setFunction(name: string): void;
    push(param: string | number | boolean | null | ScriptFunctionConfig): void;
    toString(): any;
}
export declare const scriptFunctions: {
    [id: string]: ScriptFunctionType;
};
export declare function parseScript(config: any, functionNames?: string[]): ScriptFunctionConfig | undefined;
export default ScriptFunction;
