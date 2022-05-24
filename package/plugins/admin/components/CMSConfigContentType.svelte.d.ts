import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { ContentTypeConfigSetting } from "sveltecms/core/ContentType";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: ContentTypeConfigSetting;
        adminPath: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigContentTypeProps = typeof __propDef.props;
export declare type CmsConfigContentTypeEvents = typeof __propDef.events;
export declare type CmsConfigContentTypeSlots = typeof __propDef.slots;
export default class CmsConfigContentType extends SvelteComponentTyped<CmsConfigContentTypeProps, CmsConfigContentTypeEvents, CmsConfigContentTypeSlots> {
}
export {};
