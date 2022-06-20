import { SvelteComponentTyped } from "svelte";
import type { FieldableEntity, FieldableEntityConfigSetting } from "sveltecms";
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type { FieldConfigSetting } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity?: FieldableEntity | FieldableEntityConfigSetting | FieldConfigSetting;
        contentTypeID?: string;
        content: Content;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ContentProps = typeof __propDef.props;
export declare type ContentEvents = typeof __propDef.events;
export declare type ContentSlots = typeof __propDef.slots;
export default class Content extends SvelteComponentTyped<ContentProps, ContentEvents, ContentSlots> {
}
export {};
