import type { CMSPluginBuilder } from "$lib";
declare const firestoreBuilder: CMSPluginBuilder;
export declare function parseListQuery(listQuery: any, useClientSDK?: boolean): {
    compositeFilter: {
        op: string;
        filters: any;
    };
};
export default firestoreBuilder;
