import type { SvelteCMSPlugin } from "$lib/global"

export const firebaseFirestore = {
  id: 'firebase-firestore',
  fn: (content, opts) => {

  },
  optionFields: {

  }
}

export const firebaseStorage = {
  id: 'firebase-storage',
  fn: (files, opts) => {

  },
  optionFields: {

  }
}

const SvelteCMSPluginFirebase:SvelteCMSPlugin = {
  contentStores: [
    firebaseFirestore
  ],
  mediaStores: [
    firebaseStorage
  ],
}

export default SvelteCMSPluginFirebase