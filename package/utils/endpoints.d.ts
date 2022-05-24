import type { ContentType } from "sveltecms/core/ContentType";
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
declare function parseRequest(cms: SvelteCMS, contentType: string | ContentType, request: Request): Promise<{
    format: string;
    data: any;
}>;
declare function saveContentEndpoint(cms: SvelteCMS, contentType: string | ContentType, request: Request, options?: {}): Promise<Content>;
declare function deleteContentEndpoint(cms: SvelteCMS, contentType: string | ContentType, request: Request, options?: {}): Promise<Content>;
export { parseRequest, saveContentEndpoint, deleteContentEndpoint, };
