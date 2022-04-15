const defaultOptions = {
    firebaseConfig: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
    },
    collection: "",
    listFields: [],
    listQuery: [],
    useEmulators: false,
    server: "",
};
const firestoreBuilder = (options) => {
    const firebaseConfig = Object.assign({
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
    }, options?.firebaseConfig ?? {});
    const optionFields = {
        collection: {
            type: "text",
            default: ''
        },
        server: {
            type: "text",
            default: '',
        },
        listFields: {
            type: "tags",
            default: [],
        },
        listQuery: {
            type: "collection",
            multiple: true,
            default: [],
            fields: {
                field: {
                    type: "text",
                    default: "",
                    required: true,
                },
                op: {
                    type: "text",
                    default: "",
                    required: true,
                    widget: "select",
                    widgetOptions: {
                        options: operators
                    }
                },
                valueType: {
                    type: "text",
                    default: "stringValue",
                    required: true,
                    widget: "select",
                    widgetOptions: {
                        stringValue: "string",
                        nullValue: "null",
                        booleanValue: "boolean",
                        integerValue: "integer",
                        doubleValue: "double",
                        timestampValue: "timestamp",
                    }
                },
                value: {
                    type: "text",
                    default: "",
                    required: true,
                },
            }
        },
        firebaseConfig: {
            type: "collection",
            default: {},
            fields: {
                apiKey: {
                    type: "text",
                    default: firebaseConfig?.apiKey ?? "",
                },
                authDomain: {
                    type: "text",
                    default: firebaseConfig?.authDomain ?? "",
                },
                projectId: {
                    type: "text",
                    default: firebaseConfig?.projectId ?? "",
                },
                storageBucket: {
                    type: "text",
                    default: firebaseConfig?.storageBucket ?? "",
                },
                messagingSenderId: {
                    type: "text",
                    default: firebaseConfig?.messagingSenderId ?? "",
                },
                appId: {
                    type: "text",
                    default: firebaseConfig?.appId ?? "",
                },
            }
        }
    };
    function getUrl(firebaseConfig, collection, path = '', database = '(default)') {
        let base = 'https://firestore.googleapis.com';
        if (options.useEmulators) {
            console.log('firebaseFirestore: using emulator');
            base = 'http://localhost:8080';
        }
        else if (options?.server)
            base = options.server.replace(/\/+$/, '');
        return `${base}/v1/projects/${firebaseConfig.projectId}/databases/${database}/documents/${collection}/${path}?key=${firebaseConfig.apiKey}`.replace(/\/+\?/, '?');
    }
    return {
        optionFields,
        contentStores: [
            {
                id: 'firebaseFirestore',
                optionFields,
                listContent: async (contentType, opts) => {
                    let headers = {};
                    // Set auth token if provided
                    if (opts.bearerToken)
                        headers['Authorization'] = `Bearer ${opts.token}`;
                    let body = JSON.stringify({ structuredQuery: {
                            from: [{
                                    collectionId: opts.collection || contentType.id,
                                }],
                            select: parseListFields(opts.listFields),
                            orderBy: opts.orderBy || undefined,
                            offset: opts.offset || undefined,
                            limit: opts.limit || undefined,
                            where: parseListQuery(opts.listQuery),
                        } }, null, 2);
                    let url = getUrl(opts.firebaseConfig, 'runQuery').replace('/runQuery', ':runQuery');
                    const res = await fetch(url, { method: 'POST', headers, body });
                    if (!res.ok) {
                        console.error(body);
                        return resError(res);
                    }
                    const json = await res.json();
                    return json.map(document => decode(document.document));
                },
                getContent: async (contentType, opts, slug = '') => {
                    let headers = {};
                    // Set auth token if provided
                    if (opts.bearerToken)
                        headers['Authorization'] = `Bearer ${opts.bearerToken}`;
                    const res = await fetch(getUrl(opts.firebaseConfig, opts.collection || contentType.id, slug.toString()), { headers });
                    if (!res.ok)
                        return resError(res);
                    const json = await res.json();
                    return (Array.isArray(json.documents)) ? json.documents.map(decode) : decode(json);
                },
                saveContent: async (content, contentType, opts) => {
                    let headers = {};
                    // Set auth token if provided
                    if (opts.bearerToken)
                        headers['Authorization'] = `Bearer ${opts.bearerToken}`;
                    let body = JSON.stringify(jsonToDocument(content).mapValue, null, 2);
                    if (!body || !body.length)
                        throw new Error(`Bad conversion to Firestore Document format.`);
                    let res = await fetch(getUrl(opts.firebaseConfig, (opts.collection || contentType.id), (opts.slug || content.slug || '')), { method: 'PATCH', headers, body });
                    if (!res.ok) {
                        console.error(body);
                        return resError(res);
                    }
                    return res;
                },
                deleteContent: async (content, contentType, opts) => {
                    let headers = {};
                    // Set auth token if provided
                    if (opts.bearerToken)
                        headers['Authorization'] = `Bearer ${opts.bearerToken}`;
                    let res = await fetch(getUrl(opts.firebaseConfig, opts.collection || contentType.id, content.slug), { method: 'DELETE', headers });
                    if (!res.ok)
                        return resError(res);
                    return res;
                },
            }
        ],
    };
};
function parseListFields(fields) {
    if (typeof fields === 'string')
        fields = fields.split(/\s*,\s*/g);
    return {
        fields: fields.map(fieldPath => {
            return { fieldPath };
        })
    };
}
function parseListQueryValue(item) {
    let value = item.value;
    switch (item.op) {
        case "ARRAY_CONTAINS_ANY":
        case "IN":
        case "NOT_IN":
            value = value.trim().split(/\s*,\s*/g);
        default:
            switch (item.valueType) {
                case "stringValue":
                case "string":
                case "text":
                    return value;
                case "integerValue":
                case "integer":
                case "number":
                    return Array.isArray(value) ? value.map(parseInt) : parseInt(value);
                default:
                    return Array.isArray(value) ? value.map(parseDocumentValueType) : parseDocumentValueType(value);
            }
    }
}
function parseDocumentValueType(value) {
    if (typeof value === 'number') {
        if (Number.isInteger(value))
            return { integerValue: value }; // integers
        return { doubleValue: value }; // decimals
    }
    // deepcode ignore UseNumberIsNan: <isNaN functions as desired in this instance.>
    if (value instanceof Date && !isNaN(value.valueOf()))
        return { timestampValue: value };
    if (value === 'null' || value === null)
        return { nullValue: null };
    if (value === 'true')
        value = true;
    else if (value === 'false')
        value = false;
    if (typeof value === 'boolean')
        return { booleanValue: value };
    else if (value.match(/^\d+$/))
        return { integerValue: parseInt(value) };
    else if (value.match(/^\d+\.\d+$/))
        return { doubleValue: parseFloat(value) };
    return { stringValue: value };
}
export function parseListQuery(listQuery, useClientSDK = false) {
    return {
        compositeFilter: {
            op: "AND",
            filters: listQuery.map(item => {
                return {
                    fieldFilter: {
                        field: {
                            fieldPath: item.field,
                        },
                        op: useClientSDK ? operators[item.op] : item.op,
                        value: parseListQueryValue(item)
                    },
                };
            })
        }
    };
}
async function resError(res) {
    console.log(res);
    let err = await (res.json());
    throw err.error;
}
function decode(json) {
    let document = Object.assign({
        _meta: {
            createTime: json.createTime,
            updateTime: json.updateTime,
            name: json.name,
        }
    }, documentToJson(json.fields));
    return document;
}
// from https://stackoverflow.com/questions/62246410/how-to-convert-a-firestore-document-to-plain-json-and-vice-versa, modified
let jsonToDocument = function (value) {
    if (value === null) {
        return { 'nullValue': null };
    }
    else if (typeof value == 'string') {
        return { 'stringValue': value };
    }
    else if (typeof value === 'number') {
        if (value.toString().indexOf('.') != -1)
            return { 'doubleValue': value };
        else
            return { 'integerValue': value };
    }
    else if (value === 'true' || value === 'false' || typeof value == 'boolean') {
        return { 'booleanValue': value };
        // deepcode ignore UseNumberIsNan: <isNaN functions as desired in this instance.>
    }
    else if (value instanceof Date && !isNaN(value.valueOf())) {
        return { 'timestampValue': value };
    }
    else if (Array.isArray(value)) {
        return { 'arrayValue': { values: value.map(v => jsonToDocument(v)) } };
    }
    else if (typeof value === 'object') {
        let obj = {};
        for (let o in value) {
            obj[o] = jsonToDocument(value[o]);
        }
        return { 'mapValue': { fields: obj } };
    }
};
let documentToJson = function (fields) {
    let result = {};
    for (let f in fields) {
        let key = f, value = fields[f], isDocumentType = ['stringValue', 'booleanValue', 'doubleValue',
            'integerValue', 'timestampValue', 'mapValue', 'arrayValue', 'nullValue'].find(t => t === key);
        if (isDocumentType) {
            let item = ['stringValue', 'booleanValue', 'doubleValue', 'integerValue', 'timestampValue', 'nullValue']
                .find(t => t === key);
            if (item)
                return value;
            else if ('mapValue' == key)
                return documentToJson(value.fields || {});
            else if ('arrayValue' == key) {
                let list = value.values;
                return !!list ? list.map(l => documentToJson(l)) : [];
            }
        }
        else {
            if (key !== '__proto__')
                result[key] = documentToJson(value);
        }
    }
    return result;
};
const operators = {
    "LESS_THAN": "<",
    "LESS_THAN_OR_EQUAL": "<=",
    "GREATER_THAN": ">",
    "GREATER_THAN_OR_EQUAL": ">=",
    "EQUAL": "==",
    "NOT_EQUAL": "!=",
    "ARRAY_CONTAINS": "array-contains",
    "ARRAY_CONTAINS_ANY": "array-contains-any",
    "IN": "in",
    "NOT_IN": "not-in",
};
const valueTypes = {
    stringValue: "string",
    integerValue: "number",
    nullValue: "null",
    booleanValue: "boolean",
    doubleValue: "double (number)",
    timestampValue: "timestamp",
};
export default firestoreBuilder;
