import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../..";
import type Field from "../../core/Field";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: Field;
        item: string | {
            src: string;
            alt?: string;
            title?: string;
        };
        displayMode: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ImageProps = typeof __propDef.props;
export declare type ImageEvents = typeof __propDef.events;
export declare type ImageSlots = typeof __propDef.slots;
export default class Image extends SvelteComponentTyped<ImageProps, ImageEvents, ImageSlots> {
}
export {};
