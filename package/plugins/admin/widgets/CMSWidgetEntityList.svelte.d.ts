import { SvelteComponentTyped } from "svelte";
import type { EntityConfigSetting, WidgetField } from "../../..";
import type SvelteCMS from "../../..";
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        id: string;
        field?: WidgetField;
        value: {
            [id: string]: string | EntityConfigSetting;
        };
        url: URL;
        options?: {
            entityType: string;
            isTopLevelEntity?: boolean;
        };
        addEntity?: (id: any) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CmsWidgetEntityListProps = typeof __propDef.props;
export type CmsWidgetEntityListEvents = typeof __propDef.events;
export type CmsWidgetEntityListSlots = typeof __propDef.slots;
export default class CmsWidgetEntityList extends SvelteComponentTyped<CmsWidgetEntityListProps, CmsWidgetEntityListEvents, CmsWidgetEntityListSlots> {
    get addEntity(): (id: any) => void;
}
export {};
