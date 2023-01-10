import { SvelteComponentTyped } from "svelte";
import type { DisplayableEntity, EntityType, FieldableEntity } from "../..";
import type SvelteCMS from "../..";
import type { Content } from "../../core/ContentStore";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity?: EntityType & FieldableEntity & DisplayableEntity;
        item: Content;
        displayMode: string;
        class?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ContentItemProps = typeof __propDef.props;
export type ContentItemEvents = typeof __propDef.events;
export type ContentItemSlots = typeof __propDef.slots;
export default class ContentItem extends SvelteComponentTyped<ContentItemProps, ContentItemEvents, ContentItemSlots> {
}
export {};
