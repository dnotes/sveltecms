import type { SvelteCMSPlugin, SvelteCMSPluginBuilder, SvelteCMSConfigFieldConfigSetting } from "$lib/global"
import * as lodash from 'lodash'
const { isNull } = lodash

const firestoreBuilder:SvelteCMSPluginBuilder = (options:{ firebaseConfig: {
  apiKey:string
  authDomain:string
  projectId:string
  storageBucket:string
  messagingSenderId:string
  appId:string
}}):SvelteCMSPlugin => {
  const firebaseConfig = Object.assign({
    apiKey:"",
    authDomain:"",
    projectId:"",
    storageBucket:"",
    messagingSenderId:"",
    appId:"",
  }, options?.firebaseConfig ?? {})

  const optionFields:{[key:string]:SvelteCMSConfigFieldConfigSetting} = {
    collection: {
      type: "text",
      default: ''
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
  }

  return {

    optionFields,
    contentStores: [
      {
        id: 'firebaseFirestore',
        listContent: async(contentType, opts) => {

          let headers = {}

          // Set auth token if provided
          if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.token}`

          const res = await fetch(getUrl(opts.firebaseConfig, opts.collection || contentType.id), { headers })
          const json = await res.json()

          return json.documents.map(decode)

        },

        getContent: async (contentType, opts, slug = '') => {

          let headers = {}

          // Set auth token if provided
          if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.token}`

          const res = await fetch(getUrl(opts.firebaseConfig, opts.collection || contentType.id, slug), { headers })
          const json = await res.json()

          return (Array.isArray(json.documents)) ? json.documents.map(decode) : decode(json)

        },

        saveContent: async (content, contentType, opts) => {

          let headers = {}

          // Set auth token if provided
          if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.token}`

          try {
            let body = JSON.stringify(jsonToDocument(content).mapValue,null,2)
            let res = await fetch(getUrl(opts.firebaseConfig, (opts.collection || contentType.id), (opts.slug || content.slug || '')), { method: 'PATCH', headers, body })
            if (!res.ok) {
              let err = await(res.json())
              console.error(err)
              throw new Error(res.statusText)
            }
          }
          catch(e) {
            console.error(e)
          }

        },

        deleteContent: async (content, contentType, opts) => {

          let headers = {}

          // Set auth token if provided
          if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.token}`

          return fetch(getUrl(opts.firebaseConfig, opts.collection || contentType.id, content.slug), { method: 'DELETE', headers })

        },

        optionFields,

      }
    ],

  }
}


function getUrl(firebaseConfig, collection, path = '', database = '(default)') {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${database}/documents/${collection}/${path}?key=${firebaseConfig.apiKey}`
}

function decode(json) {
  let document = Object.assign({
    _meta: {
      createTime: json.createTime,
      updateTime: json.updateTime,
      name: json.name,
    }
  }, documentToJson(json.fields))
  return document
}

// from https://stackoverflow.com/questions/62246410/how-to-convert-a-firestore-document-to-plain-json-and-vice-versa, modified
let jsonToDocument = function (value) {
  if (isNull(value)) {
    return { 'nullValue': null };
  } else if (typeof value == 'string') {
    return { 'stringValue': value };
  } else if (!isNaN(value)) {
    if (value.toString().indexOf('.') != -1)
      return { 'doubleValue': value };
    else
      return { 'integerValue': value };
  } else if (value === 'true' || value === 'false' || typeof value == 'boolean') {
    return { 'booleanValue': value };
  } else if (value instanceof Date && !isNaN(value.valueOf())) {
    return { 'timestampValue': value };
  } else if (Array.isArray(value)) {
    return { 'arrayValue': { values: value.map(v => jsonToDocument(v)) } };
  } else if (typeof value === 'object') {
    let obj = {};
    for (let o in value) {
        obj[o] = jsonToDocument(value[o]);
    }
    return { 'mapValue': { fields: obj } };
  }
}

let documentToJson = function (fields) {
  let result = {};
  for (let f in fields) {
    let key = f, value = fields[f],
      isDocumentType = ['stringValue', 'booleanValue', 'doubleValue',
        'integerValue', 'timestampValue', 'mapValue', 'arrayValue', 'nullValue'].find(t => t === key);
    if (isDocumentType) {
      let item = ['stringValue', 'booleanValue', 'doubleValue', 'integerValue', 'timestampValue', 'nullValue']
        .find(t => t === key)
      if (item)
        return value;
      else if ('mapValue' == key)
        return documentToJson(value.fields || {});
      else if ('arrayValue' == key) {
        let list = value.values;
        return !!list ? list.map(l => documentToJson(l)) : [];
      }
    } else {
      result[key] = documentToJson(value)
    }
  }
  return result;
}

export default firestoreBuilder
