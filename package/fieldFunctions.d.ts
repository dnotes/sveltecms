import type { CMSFieldFunctionType } from ".";
export declare const functions: {
    [id: string]: CMSFieldFunctionType;
};
export declare class CMSFieldFunctionConfig {
    function: string;
    params: (string | number | boolean | null | CMSFieldFunctionConfig)[];
    constructor(conf?: CMSFieldFunctionConfig);
    get alias(): any;
    setFunction(name: string): void;
    push(param: string | number | boolean | null | CMSFieldFunctionConfig): void;
    toString(): any;
}
export declare function parseFieldFunctionScript(config: any, functionNames?: string[]): CMSFieldFunctionConfig | undefined;
export default functions;
