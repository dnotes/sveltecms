import type { SvelteCMSStore } from '$lib'
import type { SvelteCMSConfigFieldConfigSetting, SvelteCMSMediaStoreType, SvelteCMSPlugin, SvelteCMSPluginBuilder } from '$lib/global'
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storageBuilder:SvelteCMSPluginBuilder = (options: {firebaseConfig: {
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
    path: {
      type: 'text',
      default: '',
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
    },
  }

  return {
    mediaStores: [
      {
        id: 'firebaseStorage',
        async save(file, field, options = {}):Promise<string> {
          let opts = Object.assign({}, this.options || {}, options)
          try {
            // @ts-ignore
            const app = initializeApp(opts.firebaseConfig)
            const storage = getStorage(app)
            const fileRef = ref(storage, `${opts.path}/${file.name}`.replace(/\/+/g,'/'))
            return uploadBytes(fileRef, file).then(snap => {
              return getDownloadURL(fileRef)
            })
          }
          catch(e) {
            console.error(e)
          }
        },
        optionFields,
      }
    ],
  }

}

export default storageBuilder