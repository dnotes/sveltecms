import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { Field, FieldConfigSetting } from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        field: Field | FieldConfigSetting;
        value: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type FieldgroupProps = typeof __propDef.props;
export declare type FieldgroupEvents = typeof __propDef.events;
export declare type FieldgroupSlots = typeof __propDef.slots;
export default class Fieldgroup extends SvelteComponentTyped<FieldgroupProps, FieldgroupEvents, FieldgroupSlots> {
}
export {};
