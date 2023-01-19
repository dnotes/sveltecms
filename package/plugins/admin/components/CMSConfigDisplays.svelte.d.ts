import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from '../../..';
import type { FullEntityDisplayConfig } from '../../../core/Display';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: {
            [id: string]: FullEntityDisplayConfig;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsConfigDisplaysProps = typeof __propDef.props;
export type CmsConfigDisplaysEvents = typeof __propDef.events;
export type CmsConfigDisplaysSlots = typeof __propDef.slots;
export default class CmsConfigDisplays extends SvelteComponentTyped<CmsConfigDisplaysProps, CmsConfigDisplaysEvents, CmsConfigDisplaysSlots> {
}
export {};
