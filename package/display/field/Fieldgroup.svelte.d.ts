import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "sveltecms";
import type { Content } from "sveltecms/core/ContentStore";
import type Field from "sveltecms/core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: Content & {
            _fieldgroup?: string;
        };
        displayMode: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type FieldgroupProps = typeof __propDef.props;
export declare type FieldgroupEvents = typeof __propDef.events;
export declare type FieldgroupSlots = typeof __propDef.slots;
export default class Fieldgroup extends SvelteComponentTyped<FieldgroupProps, FieldgroupEvents, FieldgroupSlots> {
}
export {};
