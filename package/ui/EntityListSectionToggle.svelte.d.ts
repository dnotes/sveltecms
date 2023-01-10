import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        section?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type EntityListSectionToggleProps = typeof __propDef.props;
export type EntityListSectionToggleEvents = typeof __propDef.events;
export type EntityListSectionToggleSlots = typeof __propDef.slots;
export default class EntityListSectionToggle extends SvelteComponentTyped<EntityListSectionToggleProps, EntityListSectionToggleEvents, EntityListSectionToggleSlots> {
}
export {};
