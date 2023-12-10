import type { ContentType } from "../core/ContentType";
import type SvelteCMS from "..";
import type { Content } from "../core/ContentStore";
declare function parseRequest(cms: SvelteCMS, contentType: string | ContentType, request: Request): Promise<{
    format: string;
    data: any;
}>;
declare function saveContentEndpoint(cms: SvelteCMS, contentType: string | ContentType, request: Request, options?: {}): Promise<Content | Content[]>;
declare function deleteContentEndpoint(cms: SvelteCMS, contentType: string | ContentType, request: Request, options?: {}): Promise<Content | Content[]>;
export { parseRequest, saveContentEndpoint, deleteContentEndpoint, };
