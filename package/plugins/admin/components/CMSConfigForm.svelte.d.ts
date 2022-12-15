import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        data: string;
        adminPath: string;
        options: {
            component: string;
            configType?: string;
            configPath?: string;
        };
        saveConfig?: () => Promise<Response>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsConfigFormProps = typeof __propDef.props;
export type CmsConfigFormEvents = typeof __propDef.events;
export type CmsConfigFormSlots = typeof __propDef.slots;
export default class CmsConfigForm extends SvelteComponentTyped<CmsConfigFormProps, CmsConfigFormEvents, CmsConfigFormSlots> {
}
export {};
