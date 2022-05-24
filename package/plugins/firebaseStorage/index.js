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
            helptext: 'The path, within your storage bucket, at which to save or retrieve content.',
        },
        firebaseConfig: {
            type: "collection",
            default: {},
            helptext: 'The Firebase configuration as provided on the "Project settings" page of your Firebase project at https://console.firebase.google.com.',
            fields: {
                apiKey: {
                    type: "text",
                    default: opts?.firebaseConfig?.apiKey ?? "",
                    helptext: 'The API key for your firebase project. Compared to most API keys, ' +
                        'Firebase API keys do not have the same security implications, and do not need to be kept secret. However, ' +
                        'in some cases it will be necessary to take other security measures for the integrity of your project.' +
                        'See https://firebase.google.com/docs/projects/api-keys.',
                },
                authDomain: {
                    type: "text",
                    default: opts?.firebaseConfig?.authDomain ?? "",
                    helptext: 'The authDomain for your Firebase app.',
                },
                projectId: {
                    type: "text",
                    default: opts?.firebaseConfig?.projectId ?? "",
                    helptext: 'The projectID for your Firebase app.',
                },
                storageBucket: {
                    type: "text",
                    default: opts?.firebaseConfig?.storageBucket ?? "",
                    helptext: 'The storageBucket for your Firebase app.',
                },
                messagingSenderId: {
                    type: "text",
                    default: opts?.firebaseConfig?.messagingSenderId ?? "",
                    helptext: 'The messagingSenderID for your Firebase app.',
                },
                appId: {
                    type: "text",
                    default: opts?.firebaseConfig?.appId ?? "",
                    helptext: 'The appId for your Firebase app.',
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
