import type { ConfigurableEntity, ConfigurableEntityType } from "..";
import type SvelteCMS from '..';
import type Field from './Field';
export declare class ScriptFunction implements ConfigurableEntity {
    id: string;
    fn: (vars: {
        cms: SvelteCMS;
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, options: {
        [key: string]: any;
    }) => any;
    vars: {
        cms: SvelteCMS;
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    };
    options: {
        [key: string]: string | number | boolean | null | undefined;
    };
    constructor(conf: string | ScriptFunctionConfig, vars: {
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, cms: SvelteCMS);
    run(): void;
}
export declare class ScriptError extends Error {
    state: string;
    tail: string;
    constructor(message: string, state: string, tail?: string);
}
export declare type ScriptFunctionType = ConfigurableEntityType & {
    admin?: boolean;
    helptext?: string;
    fn: (vars: {
        cms: SvelteCMS;
        field: Field;
        values: any;
        errors: any;
        touched: any;
        id?: string;
    }, opts: {
        [key: string]: any;
    }, event?: Event, el?: HTMLElement) => any;
};
export declare type ScriptFunctionConfigSetting = string | {
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
