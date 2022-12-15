import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from './index';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        contentTypeID: string;
        result?: any;
        values?: {
            _type: string;
        };
        errors?: {};
        touched?: {};
        disabled?: boolean;
        submitOptions?: {};
        isNew?: any;
        contentType?: import("./core/ContentType").ContentType;
        action?: string;
        method?: string;
        submit?: (event: any) => Promise<void>;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        header: {};
        submit: {};
    };
};
export type CmsEditorFormProps = typeof __propDef.props;
export type CmsEditorFormEvents = typeof __propDef.events;
export type CmsEditorFormSlots = typeof __propDef.slots;
export default class CmsEditorForm extends SvelteComponentTyped<CmsEditorFormProps, CmsEditorFormEvents, CmsEditorFormSlots> {
    get contentType(): import("./core/ContentType").ContentType;
}
export {};
