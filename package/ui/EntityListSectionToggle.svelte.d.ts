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
export declare type EntityListSectionToggleProps = typeof __propDef.props;
export declare type EntityListSectionToggleEvents = typeof __propDef.events;
export declare type EntityListSectionToggleSlots = typeof __propDef.slots;
export default class EntityListSectionToggle extends SvelteComponentTyped<EntityListSectionToggleProps, EntityListSectionToggleEvents, EntityListSectionToggleSlots> {
}
export {};
