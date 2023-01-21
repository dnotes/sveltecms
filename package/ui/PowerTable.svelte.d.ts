import { SvelteComponentTyped } from "svelte";
export interface Instructs {
    key: string;
    title?: string;
    sortable?: boolean;
    sortCaseSensitive?: boolean;
    filterable?: boolean;
    filterPhrase?: string;
    filterIsRegex?: boolean;
    parseAs?: 'text' | 'unsafe-html';
    userFunctions?: {
        customSort?(v1: string, v2: string): number;
        customFilter?(data: Data[], searchPhrase: string): {
            data: Data[];
            continue: boolean;
        };
    };
}
export interface Data {
    [_: string]: any;
}
type SortString = '' | 'asc' | 'desc';
export interface Options {
    uniquePrefix?: string;
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    paginationBlock?: 3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19;
    headerText?: boolean;
    footerText?: boolean;
    headerFilters?: boolean;
    footerFilters?: boolean;
    headerLoadingBar?: boolean;
    footerLoadingBar?: boolean;
    defaultRegexFlags?: string;
    nestedSorting?: boolean;
    isDataRemote?: boolean;
    totalRows?: number | null;
    filteredRows?: number | null;
    currentPage?: number;
    searchPhrase?: string;
    searchIsRegex?: boolean;
    checkboxColumn?: boolean;
    userFunctions?: {
        dataFeed?(data: Record<string, any>): Promise<DataFeed>;
        customParse?(data: Data[]): Data[];
        customSearch?(data: Data[], searchPhrase: string): {
            data: Data[];
            continue: boolean;
        };
    };
    segments?: Record<string, Array<'settings' | 'search' | 'pagination' | 'table' | 'dropdown' | 'stats'>>;
    sortOrder?: {
        [k in SortString]?: SortString;
    };
}
export interface DataFeed {
    instructs?: Instructs[];
    options?: Options;
    data?: Data[];
}
export type RegexParts = {
    delimiter: string;
    pattern: string;
    flags: string;
};
type Lookup = {
    value?: string;
    isRegex?: boolean;
    isCustom?: boolean;
};
export declare let dataIdKey: string;
export declare let checkboxKey: string;
export declare function getRegexParts(phrase: string): false | RegexParts;
import type SvelteCMS from '..';
import type ContentType from '../core/ContentType';
declare const __propDef: {
    props: {
        cms: SvelteCMS;
        entity: ContentType;
        ptInstructs?: Instructs[];
        ptOptions?: Options;
        ptData?: Data[];
        closePopUps?: ({ target }: Event) => void;
        closeMenu?: (e: Event) => void;
        toggleMenu?: (e: Event) => void;
        toggleCheckboxColumn?: (e: Event) => void;
        selectAllAction?: (e: Event) => void;
        selectNoneAction?: (e: Event) => void;
        invertSelectionAction?: (e: Event) => void;
        addAction?: (e: Event) => void;
        deleteAction?: (e: Event) => void;
        getData?: (removeMetadata?: boolean) => {
            options: Options;
            instructs: Instructs[];
            data: Data[];
            search: Lookup;
            filters: Record<string, Lookup>;
        };
    };
    events: {
        rowClicked: CustomEvent<any>;
        rowDblClicked: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        noResults: {};
        rendering: {};
        settings: {};
    };
};
export type PowerTableProps = typeof __propDef.props;
export type PowerTableEvents = typeof __propDef.events;
export type PowerTableSlots = typeof __propDef.slots;
export default class PowerTable extends SvelteComponentTyped<PowerTableProps, PowerTableEvents, PowerTableSlots> {
    get closePopUps(): ({ target }: Event) => void;
    get closeMenu(): (e: Event) => void;
    get toggleMenu(): (e: Event) => void;
    get toggleCheckboxColumn(): (e: Event) => void;
    get selectAllAction(): (e: Event) => void;
    get selectNoneAction(): (e: Event) => void;
    get invertSelectionAction(): (e: Event) => void;
    get addAction(): (e: Event) => void;
    get deleteAction(): (e: Event) => void;
    get getData(): (removeMetadata?: boolean) => {
        options: Options;
        instructs: Instructs[];
        data: Data[];
        search: Lookup;
        filters: Record<string, Lookup>;
    };
}
export {};
