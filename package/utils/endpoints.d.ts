import type { CMSContentType } from "sveltecms";
import type SvelteCMS from "sveltecms";
declare function parseRequest(cms: SvelteCMS, contentType: string | CMSContentType, request: Request): Promise<{
    format: string;
    data: any;
}>;
declare function saveContentEndpoint(cms: SvelteCMS, contentType: string | CMSContentType, request: Request, options?: {}): Promise<any>;
declare function deleteContentEndpoint(cms: SvelteCMS, contentType: string | CMSContentType, request: Request, options?: {}): Promise<any>;
export { parseRequest, saveContentEndpoint, deleteContentEndpoint, };
