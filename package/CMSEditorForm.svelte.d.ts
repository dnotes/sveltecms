import { SvelteComponentTyped } from "svelte";
import type SvelteCMS from './index';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        contentTypeID: string;
        previewComponent?: any;
        result?: any;
        values?: {};
        errors?: {};
        touched?: {};
        disabled?: boolean;
        submitOptions?: {};
        action?: string;
        method?: string;
        contentType?: any;
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
export declare type CmsEditorFormProps = typeof __propDef.props;
export declare type CmsEditorFormEvents = typeof __propDef.events;
export declare type CmsEditorFormSlots = typeof __propDef.slots;
export default class CmsEditorForm extends SvelteComponentTyped<CmsEditorFormProps, CmsEditorFormEvents, CmsEditorFormSlots> {
}
export {};
