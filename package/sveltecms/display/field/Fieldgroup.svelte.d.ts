import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
import type { Content } from "../../../core/ContentStore";
import type Field from "../../../core/Field";
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
export type FieldgroupProps = typeof __propDef.props;
export type FieldgroupEvents = typeof __propDef.events;
export type FieldgroupSlots = typeof __propDef.slots;
export default class Fieldgroup extends SvelteComponentTyped<FieldgroupProps, FieldgroupEvents, FieldgroupSlots> {
}
export {};
