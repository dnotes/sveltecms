import { initializeApp } from 'firebase/app';
import { getStorage, connectStorageEmulator, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { merge } from 'lodash-es';
const defaultOptions = {
    firebaseConfig: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
    },
    path: "",
    useEmulators: false,
};
const storageBuilder = (options) => {
    const opts = merge({}, defaultOptions, options);
    const optionFields = {
        path: {
            type: 'text',
            default: opts?.path ?? "",
        },
        firebaseConfig: {
            type: "collection",
            default: {},
            fields: {
                apiKey: {
                    type: "text",
                    default: opts?.firebaseConfig?.apiKey ?? "",
                },
                authDomain: {
                    type: "text",
                    default: opts?.firebaseConfig?.authDomain ?? "",
                },
                projectId: {
                    type: "text",
                    default: opts?.firebaseConfig?.projectId ?? "",
                },
                storageBucket: {
                    type: "text",
                    default: opts?.firebaseConfig?.storageBucket ?? "",
                },
                messagingSenderId: {
                    type: "text",
                    default: opts?.firebaseConfig?.messagingSenderId ?? "",
                },
                appId: {
                    type: "text",
                    default: opts?.firebaseConfig?.appId ?? "",
                },
            }
        },
    };
    function getFirebaseStorage() {
        const app = initializeApp(opts.firebaseConfig);
        const storage = getStorage(app);
        if (opts.useEmulators) { // We use only the global useEmulators here. This should not be accessible per field/contentType.
            console.log('firebaseStorage: using emulators');
            connectStorageEmulator(storage, 'localhost', 9199);
        }
        return storage;
    }
    return {
        mediaStores: [
            {
                id: 'firebaseStorage',
                immediateUpload: true,
                async getMedia(filename, opts) {
                    const storage = getFirebaseStorage();
                    const fileRef = ref(storage, `${opts.path ?? this.opts.path ?? ''}/${filename}`.replace(/\/+/g, '/'));
                    return getDownloadURL(fileRef);
                },
                async saveMedia(file, opts) {
                    const storage = getFirebaseStorage();
                    const fileRef = ref(storage, `${opts.path ?? this.opts.path ?? ''}/${file.name}`.replace(/\/+/g, '/'));
                    const snap = await uploadBytes(fileRef, file);
                    return getDownloadURL(fileRef);
                },
                optionFields,
            }
        ],
    };
};
export default storageBuilder;
