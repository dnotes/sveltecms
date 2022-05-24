import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import { type FieldConfigSetting } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data?: {
            [id: string]: string | FieldConfigSetting;
        };
        options?: {
            id?: string;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CmsConfigFieldListProps = typeof __propDef.props;
export declare type CmsConfigFieldListEvents = typeof __propDef.events;
export declare type CmsConfigFieldListSlots = typeof __propDef.slots;
export default class CmsConfigFieldList extends SvelteComponentTyped<CmsConfigFieldListProps, CmsConfigFieldListEvents, CmsConfigFieldListSlots> {
}
export {};
