import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        runImport?: () => Promise<Response>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ImportContentProps = typeof __propDef.props;
export type ImportContentEvents = typeof __propDef.events;
export type ImportContentSlots = typeof __propDef.slots;
export default class ImportContent extends SvelteComponentTyped<ImportContentProps, ImportContentEvents, ImportContentSlots> {
}
export {};
