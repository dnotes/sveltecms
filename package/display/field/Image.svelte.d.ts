import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        value: string | {
            src: string;
            alt?: string;
            title?: string;
        };
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
