import type { CMSPlugin } from "../../global";
export declare const githubContent: {
    id: string;
    fn: (content: any, opts: any, fieldType: any) => void;
    optionFields: {};
};
export declare const githubMedia: {
    id: string;
    fn: (files: any, opts: any, fieldType: any) => void;
    optionFields: {};
};
declare const CMSPluginGithub: CMSPlugin;
export default CMSPluginGithub;
