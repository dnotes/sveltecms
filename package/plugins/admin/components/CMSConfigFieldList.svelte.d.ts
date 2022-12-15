import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
import { type FieldConfigSetting } from "../../../core/Field";
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
export type CmsConfigFieldListProps = typeof __propDef.props;
export type CmsConfigFieldListEvents = typeof __propDef.events;
export type CmsConfigFieldListSlots = typeof __propDef.slots;
export default class CmsConfigFieldList extends SvelteComponentTyped<CmsConfigFieldListProps, CmsConfigFieldListEvents, CmsConfigFieldListSlots> {
}
export {};
